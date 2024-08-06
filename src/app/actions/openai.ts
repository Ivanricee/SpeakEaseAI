'use server'

import { createStreamableValue, StreamableValue } from 'ai/rsc'
import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { OpenAI } from 'openai'
import fs from 'fs'
import { AIFormSchema } from '../schema/aiForm-schema'
import { getOpenAI, getSystemPrompt } from '@/utils/openai'
import { ExtendCoreMessage } from '@/store/zustand-store'
import path from 'path'

/**
 * chat interface & types
 */
interface ChatConversation {
  model: string
  key: string
  history: ExtendCoreMessage[]
  nivel: string
  tema: string
  aditionalRole: string
}
export type ClientMessage = {
  messages: ExtendCoreMessage[]
  outputMsg: StreamableValue<string>
}
export async function chatConversation({
  model,
  key,
  history,
  nivel,
  tema,
  aditionalRole,
}: ChatConversation): Promise<ClientMessage> {
  const system = getSystemPrompt({ aditionalRole, nivel, tema })
  const streamableStatus = createStreamableValue('')
  const sdkOpenai = createOpenAI({
    apiKey: key,
  })
  const messages = history.map((message) => ({
    role: message.role,
    content: message.content,
  })) as CoreMessage[]
  try {
    ;(async () => {
      //const system = `Act as an English tutor interacting with a student of {${nivel}} level.`
      const { textStream } = await streamText({
        model: sdkOpenai(model),
        system,
        messages,
        maxTokens: 512,
      })
      for await (const text of textStream) {
        streamableStatus.update(text)
      }
      streamableStatus.done()
    })().catch((e) => {
      streamableStatus.update(e.message)
      streamableStatus.done()
    })
  } catch (error) {
    console.error('Error al acceder al iniciar chat', error)
  }
  return {
    messages: history,
    outputMsg: streamableStatus.value,
  }
}

/**
 * speech to text interface
 */
interface SpeechToText {
  formData: FormData
  message?: CoreMessage[]
}
export type TextReturn = {
  text: string
}
export async function speechToText({ formData, message }: SpeechToText): Promise<TextReturn> {
  'use server'
  const audio = formData.get('audio') as File
  const apiKey = formData.get('apiKey') as string

  if (!audio) return { text: 'No audio file' }

  const buffer = await audio.arrayBuffer()
  const audioBuffer = Buffer.from(buffer)
  const uint8Array = new Uint8Array(audioBuffer)
  try {
    const auioPath = `temp/${audio.name}`
    await fs.writeFileSync(auioPath, uint8Array)
    const readStream = fs.createReadStream(auioPath)
    const openai = new OpenAI({
      apiKey: apiKey,
    })
    const transcription = await openai.audio.transcriptions.create({
      file: readStream,
      model: 'whisper-1',
      response_format: 'verbose_json',
      language: 'en',
    })
    //console.log(`Attempting to delete file: ${auioPath}`, readStream.path)
    readStream.destroy()
    fs.unlinkSync(auioPath)
    const text = await transcription.text
    return { text }
  } catch (error) {
    console.error('Failed to write or delete file:', error)
    return { text: 'we couldnt transcribe the audio' }
  }
}

/**
 * text to speech
 */
interface TextToSpeech {
  message: string
  apiKey: string
}
export async function textToSpeech({ message, apiKey }: TextToSpeech) /*: Promise<Blob>*/ {
  'use server'

  try {
    const speechFile = path.resolve('public/speechGenerated.webm')
    const openai = new OpenAI({
      apiKey: apiKey,
    })
    const audio = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: message,
    })
    console.log('audio', audio)
    const buffer = Buffer.from(await audio.arrayBuffer())
    const uint8Array = new Uint8Array(buffer.buffer)
    await fs.promises.writeFile(speechFile, uint8Array)
  } catch (error) {
    console.error('Failed to write or delete file:', error)
    //return { text: 'we couldnt transcribe the audio' }
  }
}
/**
 * check key
 */
export type KeyState = {
  isValidKey: boolean | null
}
export async function setKey(prevState: KeyState, formData: FormData): Promise<KeyState> {
  const apiKey = formData.get('key') as string

  const data = Object.fromEntries(formData)
  const parseData = await AIFormSchema.safeParseAsync(data)
  const keySuccess = parseData.success
  const keyError = parseData.error
  if (!keySuccess) {
    console.log('key validation error', keyError)
    return { isValidKey: false }
  }
  try {
    if (apiKey) {
      const openai = new OpenAI({
        apiKey: apiKey,
      })
      await openai.models.list()
      return { isValidKey: true }
    }
    return { isValidKey: false }
  } catch (e: any) {
    console.log('Authentication error', e.message)
    return { isValidKey: false }
  }
}

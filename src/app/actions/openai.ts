'use server'

import { createStreamableValue, StreamableValue } from 'ai/rsc'
import { CoreMessage, streamObject, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { OpenAI, toFile } from 'openai'
import { AIFormSchema } from '../schema/aiForm-schema'
import { getSystemPrompt } from '@/utils/openai'
import { ExtendCoreMessage } from '@/store/zustand-store'
import { put } from '@vercel/blob'
import { Readable } from 'stream'
import { revalidatePath } from 'next/cache'
import { validateAzureKey } from './azure'
import { z } from 'zod'
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
      const { textStream } = await streamObject({
        model: sdkOpenai(model),
        schema: z.object({
          languageEnhancementFeedback: z.string().optional(),
          topicCorrection: z.string().optional(),
          contextualFollowUpQuestion: z.string(),
        }),
        system,
        messages,
        maxTokens: 250,
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
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const converted = await toFile(Readable.from(audioBuffer), 'recording.webm')
    const transcription = await openai.audio.transcriptions.create({
      file: converted,
      model: 'whisper-1',
      response_format: 'verbose_json',
      language: 'en',
    })
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
export async function textToSpeech({ message, apiKey }: TextToSpeech): Promise<string> {
  'use server'

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    })
    const audio = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: message,
    })

    const audioBuffer = await audio.arrayBuffer()
    const blob = await put('speechGenerated.webm', audioBuffer, {
      access: 'public',
    })
    revalidatePath('/')
    return blob.url
  } catch (error) {
    console.error('Failed to write or delete file:', error)
    return 'we couldnt transcribe the audio'
  }
}
/**
 * check key
 */
export type KeyState = {
  isOpenAiValidKey: boolean | null
  isAzureValidKey: boolean | null
}
interface FormDataObject {
  key: string
  enableAzure: string // Se mantiene como string inicialmente
  azureKey?: string
  azureRegion?: string
}
export async function setKey(prevState: KeyState, formData: FormData): Promise<KeyState> {
  const apiKey = formData.get('key') as string
  const azureKey = formData.get('azureKey') as string
  const azureRegion = formData.get('azureRegion') as string

  const data = Object.fromEntries(formData) as Record<string, FormDataEntryValue>
  const enableAzure = data.enableAzure === 'true'
  const parseData = await AIFormSchema.safeParseAsync({
    ...data,
    enableAzure, // Reemplaza el valor de enableAzure con el tipo correcto
  })
  const validateSuccess = parseData.success
  const keyError = parseData.error
  if (!validateSuccess) {
    console.log('keys validation error', keyError)
    return { isOpenAiValidKey: false, isAzureValidKey: false }
  }
  const isOpenAiValidKey = await validateOpenAiKey(apiKey)
  if (enableAzure) {
    const isAzureValidKey = await validateAzureKey(azureKey, azureRegion)
    return { isOpenAiValidKey, isAzureValidKey }
  }
  return { isOpenAiValidKey: isOpenAiValidKey, isAzureValidKey: null }
}

const validateOpenAiKey = async (apiKey: string) => {
  try {
    if (apiKey) {
      const openai = new OpenAI({
        apiKey: apiKey,
      })
      await openai.models.list()
      return true
      //return { isOpenAiValidKey: true, isAzureValidKey: false }
    }
    return false
    //return { isOpenAiValidKey: false, isAzureValidKey: false }
  } catch (e: any) {
    console.log('Authentication error', e.message)
    return false
    //return { isOpenAiValidKey: false, isAzureValidKey: false }
  }
}

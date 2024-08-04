'use server'

import { createStreamableValue, StreamableValue } from 'ai/rsc'
import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { OpenAI } from 'openai'
import fs from 'fs'
import { AIFormSchema } from '../schema/aiForm-schema'
import { getOpenAI, getSystemPrompt } from '@/utils/openai'

const sdkOpenai = createOpenAI({
  apiKey: '',
})

/**
 * chat interface & types
 */
interface ChatConversation {
  history: CoreMessage[]
  nivel: string
  tema: string
  aditionalRole: string
}
export type ClientMessage = {
  messages: CoreMessage[]
  outputMsg: StreamableValue<string>
}
export async function chatConversation({
  history,
  nivel,
  tema,
  aditionalRole,
}: ChatConversation): Promise<ClientMessage> {
  const system = getSystemPrompt({ aditionalRole, nivel, tema })
  const streamableStatus = createStreamableValue('')

  try {
    ;(async () => {
      //const system = `Act as an English tutor interacting with a student of {${nivel}} level.`
      const { textStream } = await streamText({
        model: sdkOpenai('gpt-4o-mini'),
        system,
        messages: history,
        maxTokens: 512,
      })
      for await (const text of textStream) {
        console.log('text server', text)

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
export async function speechToText({ formData, message }: SpeechToText) {
  'use server'
  const audio = formData.get('audio') as File
  //const apiKey = formData.get('apiKey')
  if (!audio) return
  console.log('formdata ', {
    data: formData.get('audio'),
  })

  const buffer = await audio.arrayBuffer()
  const audioBuffer = Buffer.from(buffer)
  const uint8Array = new Uint8Array(audioBuffer)
  try {
    const auioPath = `temp/${audio.name}`
    await fs.writeFileSync(auioPath, uint8Array)
    const readStream = fs.createReadStream(auioPath)

    /*const transcription = await openai.audio.transcriptions.create({
      file: readStream,
      model: 'whisper-1',
    })*/
    //console.log(`Attempting to delete file: ${auioPath}`, readStream.path)
    readStream.destroy()
    fs.unlinkSync(auioPath)

    //return NextResponse.json(transcription)
  } catch (error) {
    console.error('Failed to write or delete file:', error)
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
  console.log('apiKey recibida--------------------------', apiKey)

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
  } catch (e) {
    console.log('error-------------------: ', e)
    return { isValidKey: false }
  }
}

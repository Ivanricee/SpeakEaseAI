import { speechToText, textToSpeech } from '@/app/actions/openai'
import { useAppStore } from '@/store/zustand-store'

type hookReturnType = {
  getAudioFromText: ({ message }: { message: string }) => Promise<string | null> | string
}
export const useTextToSpeech = (): hookReturnType => {
  const { openAiKey } = useAppStore((state) => ({
    openAiKey: state.openAiKey.key,
  }))
  const getAudioFromText = async ({ message }: { message: string }) => {
    if (!openAiKey) return 'api key not set'

    await textToSpeech({
      message: message,
      apiKey: openAiKey,
    })
    const audioFileName = 'speechGenerated.webm'
    const url = await getAudioBlobAndUrl(audioFileName)
    return url
  }
  return { getAudioFromText }
}

async function getAudioBlobAndUrl(audioFileName: string) {
  const filePath = `./${audioFileName}`
  console.log('filePath', filePath)

  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return url
  } catch (error) {
    console.error('Error reading audio file:', error)
    return null
  }
}

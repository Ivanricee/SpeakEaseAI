import { textToSpeech } from '@/app/actions/openai'
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

    const url = await textToSpeech({
      message: message,
      apiKey: openAiKey,
    })

    return url
  }
  return { getAudioFromText }
}

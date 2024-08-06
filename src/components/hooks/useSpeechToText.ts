import { speechToText } from '@/app/actions/openai'
import { useAppStore } from '@/store/zustand-store'

type hookReturnType = {
  transcribeAudio: (audioBlob: Blob) => Promise<string>
}
export const useSpeechToText = (): hookReturnType => {
  const { openAiKey } = useAppStore((state) => ({
    openAiKey: state.openAiKey.key,
  }))
  const transcribeAudio = async (audioBlob: Blob) => {
    if (!openAiKey) return 'api key not set'

    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    formData.append('apiKey', openAiKey)
    const { text } = await speechToText({ formData })
    return text
  }
  return { transcribeAudio }
}

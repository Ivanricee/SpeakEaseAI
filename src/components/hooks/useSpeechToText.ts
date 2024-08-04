import { speechToText } from '@/app/actions/openai'

type hookReturnType = {
  transcribeAudio: (audioBlob: Blob) => void
}
export const useSpeechToText = (): hookReturnType => {
  const transcribeAudio = (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    speechToText({ formData })

    return 'text from audio here: '
  }
  return { transcribeAudio }
}

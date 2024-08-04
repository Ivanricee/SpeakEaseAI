import { speechToTextAssesment } from '@/app/actions/azure'

type hookReturnType = {
  speechAssesment: (audioBlob: Blob) => void
}
export const useSpeechAssesment = (): hookReturnType => {
  const speechAssesment = (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recordCombined.wav')
    speechToTextAssesment({ formData })

    return 'result text from audio assesmenthere: '
  }
  return { speechAssesment }
}

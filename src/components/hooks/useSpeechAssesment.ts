import { speechToTextAssesment } from '@/app/actions/azure'
import { useAppStore } from '@/store/zustand-store'
import { AssessmentResult } from '@/types/assesmentResult'
import Crunker from 'crunker'

type hookReturnType = {
  speechAssesment: ({ audioBlob, referenceText, id }: AssesmenType) => void
}
type AssesmenType = {
  audioBlob: Blob
  referenceText: string
  id: string
}

export const useSpeechAssesment = (): hookReturnType => {
  const { addUserAssessment } = useAppStore((state) => ({
    addUserAssessment: state.addUserAssessment,
  }))
  const speechAssesment = async ({ audioBlob, referenceText, id }: AssesmenType) => {
    let crunker = new Crunker({ sampleRate: 16000 })
    const audioBuffer = await crunker.fetchAudio(audioBlob)
    const audioWav = await crunker.export(audioBuffer[0], 'audio/wav')
    const formData = new FormData()
    formData.append('audio', audioWav.blob, 'userAssesment.wav')
    formData.append('referenceText', referenceText)
    const resAssesmentStr = await speechToTextAssesment({ formData })
    const resAssesment = JSON.parse(resAssesmentStr)
    resAssesment.privPronJson.id = id
    addUserAssessment({ id, userAssessment: resAssesment.privPronJson })
    //return resAssesment.privPronJson as AssessmentResult
  }
  return { speechAssesment }
}

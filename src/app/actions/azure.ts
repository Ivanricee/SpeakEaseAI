'use server'

import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
  ResultReason,
  CancellationDetails,
  CancellationReason,
  PropertyId,
  PronunciationAssessmentConfig,
  PronunciationAssessmentGradingSystem,
  PronunciationAssessmentGranularity,
  PronunciationAssessmentResult,
} from 'microsoft-cognitiveservices-speech-sdk'

interface UserAssesment {
  formData: FormData
}

export async function speechToTextAssesment({ formData }: UserAssesment): Promise<string> {
  'use server'
  const audio = formData.get('audio') as File
  const referenceText = formData.get('referenceText') as string
  const azureKey = formData.get('key') as string
  const azureRegion = formData.get('region') as string

  if (!audio || !referenceText || !azureKey)
    return JSON.stringify({ error: 'Audio o referencia not found' })

  try {
    const resAssesment = await getSpeechAssesment(audio, azureKey, azureRegion)
    return JSON.stringify(resAssesment)
  } catch (error) {
    console.error('Failed to write or delete file:', error)
    return JSON.stringify({ error: 'Failed in file or get assesment' })
  }

  async function getSpeechAssesment(audioFile: File, azureKey: string, azureRegion: string) {
    const speechConfig = SpeechConfig.fromSubscription(azureKey, azureRegion)
    speechConfig.speechRecognitionLanguage = 'en-US'
    speechConfig.setProperty(PropertyId.Speech_SegmentationSilenceTimeoutMs, '5000')

    const buffer = await audioFile.arrayBuffer()
    const audioBuffer = Buffer.from(buffer)
    const audioConfig = AudioConfig.fromWavFileInput(audioBuffer)
    AudioConfig.fromWavFileInput

    //Prnunciation assesment
    const pronAssesmentConf = new PronunciationAssessmentConfig(
      referenceText,
      PronunciationAssessmentGradingSystem.HundredMark,
      PronunciationAssessmentGranularity.Phoneme,
      false
    )
    pronAssesmentConf.phonemeAlphabet = 'IPA'
    pronAssesmentConf.enableProsodyAssessment = true
    //pronAssesmentConf.enableContentAssessmentWithTopic('establecer aqui topic hablado')
    //---------------------
    //speech recognizer
    let speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig)
    pronAssesmentConf.applyTo(speechRecognizer)

    return new Promise((resolve, reject) => {
      speechRecognizer.recognizeOnceAsync(
        (result) => {
          //console.log({ key: pronAssesmentConf.properties, result })
          switch (result.reason) {
            case ResultReason.RecognizedSpeech:
              const pronunciation_result = PronunciationAssessmentResult.fromResult(result)
              resolve(pronunciation_result)
              break
            case ResultReason.NoMatch:
              resolve({ error: 'NOMATCH: Speech could not be recognized.' })
              break
            case ResultReason.Canceled:
              const cancellation = CancellationDetails.fromResult(result)
              console.log(`CANCELED: Reason=${cancellation.reason}`)

              if (cancellation.reason == CancellationReason.Error) {
                console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`)
                console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`)
                resolve({
                  error: 'Error in speech, resource, key and region not set',
                })
              }
              break
          }
          speechRecognizer.close()
        },
        (err) => {
          console.error(err)
          reject(err) // Rechaza la promesa con el error
        }
      )
    })
    /* type RecognitionResult
      console.log('pronunciation assessment for: ', result.text)
        'grammar: ',
        pronunciation_result.contentAssessmentResult.grammarScore,
        'vocabulary: ',
        pronunciation_result.contentAssessmentResult.vocabularyScore,
        'topic score: ',
        pronunciation_result.contentAssessmentResult.topicScore
    */
  }
}

export const validateAzureKey = async (azureKey: string, azureRegion: string) => {
  const endpoint = `https://${azureRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Ocp-Apim-Subscription-Key': azureKey,
      },
    })
    return response.ok
  } catch (e: any) {
    console.log('Azue Authentication error', e.message)
    return false
  }
}

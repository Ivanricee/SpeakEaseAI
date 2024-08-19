'use server'

import fs from 'fs'
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
  RecognitionResult,
} from 'microsoft-cognitiveservices-speech-sdk'

const speechConfig = SpeechConfig.fromSubscription(
  process.env.AZ_SPEECH_KEY as string,
  process.env.AZ_SPEECH_REGION as string
)
speechConfig.speechRecognitionLanguage = 'en-US'
speechConfig.setProperty(PropertyId.Speech_SegmentationSilenceTimeoutMs, '5000')
interface UserAssesment {
  formData: FormData
}

export async function speechToTextAssesment({ formData }: UserAssesment): Promise<string> {
  'use server'
  const audio = formData.get('audio') as File
  const referenceText = formData.get('referenceText') as string
  if (!audio || !referenceText) return JSON.stringify({ error: 'Audio o referencia not found' })

  const buffer = await audio.arrayBuffer()
  const audioBuffer = Buffer.from(buffer)
  const uint8Array = new Uint8Array(audioBuffer)
  try {
    const auioPath = `temp/${audio.name}`
    await fs.writeFileSync(auioPath, uint8Array)
    const resAssesment = await getSpeechAssesment(auioPath)

    fs.unlinkSync(auioPath)
    return JSON.stringify(resAssesment)
  } catch (error) {
    console.error('Failed to write or delete file:', error)
    return JSON.stringify({ error: 'Failed in file or get assesment' })
  }

  async function getSpeechAssesment(filePath: string) {
    const audio = fs.readFileSync(filePath)
    const audioConfig = AudioConfig.fromWavFileInput(audio)
    //let resAssesmentResult: any = null
    //Prnunciation assesment
    const pronAssesmentConf = new PronunciationAssessmentConfig(
      referenceText,
      PronunciationAssessmentGradingSystem.HundredMark,
      PronunciationAssessmentGranularity.Phoneme,
      false
    )
    pronAssesmentConf.enableProsodyAssessment = true
    //pronAssesmentConf.enableContentAssessmentWithTopic('establecer aqui topic hablado')
    //---------------------
    //speech recognizer
    let speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig)
    pronAssesmentConf.applyTo(speechRecognizer)

    return new Promise((resolve, reject) => {
      speechRecognizer.recognizeOnceAsync(
        (result) => {
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
                  error: 'CANCELED: Did you set the speech resource key and region values?',
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

      console.log(
        ' Accuracy score: ',
        pronunciation_result.accuracyScore,
        '\n',
        'pronunciation score: ',
        pronunciation_result.pronunciationScore,
        '\n',
        'completeness score : ',
        pronunciation_result.completenessScore,
        '\n',
        'fluency score: ',
        pronunciation_result.fluencyScore,
        '\n',
        'prosody score: ',
        pronunciation_result.prosodyScore,
        '\n',
        'grammar: ',
        pronunciation_result.contentAssessmentResult.grammarScore,
        'vocabulary: ',
        pronunciation_result.contentAssessmentResult.vocabularyScore,
        'topic score: ',
        pronunciation_result.contentAssessmentResult.topicScore
      )
      console.log('  Word-level details:')
      pronunciation_result.detailResult.Words.forEach((word, idx) => {
        //console.log({ word })

        console.log(`    ${idx + 1}: word: ${word.Word} \n
          acuracy score: ${word.PronunciationAssessment?.AccuracyScore} \n
          error type: ${word.PronunciationAssessment?.ErrorType}`)
      })*/
  }
}

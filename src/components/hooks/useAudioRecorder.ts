import { useRef, useState } from 'react'
import Crunker from 'crunker'
import { useSpeechToText } from './useSpeechToText'
import { useSpeechAssesment } from './useSpeechAssesment'
import useAiChat from './useAIChat'

type hookReturnType = {
  audioUrl: string | null
  fullAudioUrl: string | null
  isRecording: boolean
  startRecording: () => void
  stopRecording: () => void
  getSpeechAssesment: () => void
}
type audioCombinedType = {
  duration: number
  blob: Blob | null
}
export const useAudioRecorder = (): hookReturnType => {
  const { transcribeAudio } = useSpeechToText()
  const { speechAssesment } = useSpeechAssesment()
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [fullAudioUrl, setFullAudioUrl] = useState<string | null>(null)
  const mediaStream = useRef<MediaStream | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioBlobArray = useRef<string[]>([])
  const audioCombined = useRef<audioCombinedType>({
    duration: 0,
    blob: null,
  })
  const chunks = useRef<Blob[]>([])
  const { chatAi, conversation } = useAiChat()
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStream.current = stream
      initMediaRecorder(stream)
    } catch (error) {
      console.error('Error al acceder al microfono', error)
    }
  }
  const initMediaRecorder = (stream: MediaStream) => {
    mediaRecorder.current = new MediaRecorder(stream, {
      audioBitsPerSecond: 64000,
    })
    mediaRecorder.current.start()
    mediaRecorder.current.ondataavailable = (ev) => {
      if (ev.data.size > 0) {
        chunks.current.push(ev.data)
      }
    }
    mediaRecorder.current.onstop = async () => {
      if (chunks?.current.length > 0) {
        const audioBlobRecorded = new Blob(chunks.current, {
          type: 'audio/webm',
        })

        /**hook to get text from audio & start ai chat*/
        const userContent = await transcribeAudio(audioBlobRecorded)
        const url = URL.createObjectURL(audioBlobRecorded)
        chatAi({ userContent, id: url })
        //-----------------

        audioCombined.current.duration < 40 && combineAudioBlobs(url)

        setAudioUrl(url)
        chunks.current = []
      }
    }
    setIsRecording(true)
  }
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      setIsRecording(false)
      mediaRecorder.current.stop()
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }
  const combineAudioBlobs = (url: string) => {
    audioBlobArray.current.push(url)
    let crunker = new Crunker({ sampleRate: 16000 })
    if (audioBlobArray.current.length > 0) {
      crunker
        .fetchAudio(...audioBlobArray.current)
        .then((buffers) => crunker.concatAudio(buffers))
        .then((concated) => {
          audioCombined.current.duration = concated.duration
          return crunker.export(concated, 'audio/wav')
        })
        .then((output) => (audioCombined.current.blob = output.blob))
        .catch((error) => {
          throw new Error(error)
        })
    }
  }
  const getSpeechAssesment = () => {
    if (audioCombined.current.blob) {
      speechAssesment(audioCombined.current.blob)
    }
  }
  if (typeof window !== 'undefined') {
    new Crunker().notSupported(() => {
      console.log('Browser unsupported!')
    })
  }
  return {
    startRecording,
    stopRecording,
    isRecording,
    audioUrl,
    getSpeechAssesment,
    fullAudioUrl,
  }
}

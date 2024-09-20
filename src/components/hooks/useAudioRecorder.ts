import { useRef, useState } from 'react'
import Crunker from 'crunker'
import { useSpeechToText } from './useSpeechToText'
import { useSpeechAssesment } from './useSpeechAssesment'
import useAiChat from './useAIChat'
import { useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'

type hookReturnType = {
  audioUrl: string | null
  fullAudioUrl: string | null
  isRecording: boolean | null
  startRecording: () => void
  stopRecording: () => void
}
type audioCombinedType = {
  duration: number
  blob: Blob | null
}
export const useAudioRecorder = (): hookReturnType => {
  const { setDisableMicro } = useAppStore(
    useShallow((state) => ({
      disableMicro: state.disableMicro,
      setDisableMicro: state.setDisableMicro,
    }))
  )
  const { transcribeAudio } = useSpeechToText()
  const { speechAssesment } = useSpeechAssesment()
  const [isRecording, setIsRecording] = useState<boolean | null>(null)
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
  const { chatAi } = useAiChat()
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
    setIsRecording(true)
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
        //disableMicro
        await setDisableMicro(true)
        const stringId = Date.now().toString()
        const userContent = await transcribeAudio(audioBlobRecorded)
        const url = URL.createObjectURL(audioBlobRecorded)
        await chatAi({ userContent, id: stringId, urlUsr: url })
        await speechAssesment({
          audioBlob: audioBlobRecorded,
          referenceText: userContent,
          id: stringId,
        })

        //-----------------
        setAudioUrl(url)
        //audioCombined.current.duration < 40 && combineAudioBlobs(url)
        chunks.current = []
      }
    }
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
    fullAudioUrl,
  }
}

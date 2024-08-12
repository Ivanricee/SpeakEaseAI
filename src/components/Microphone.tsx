'use client'

import { useAppStore } from '@/store/zustand-store'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { Button } from './ui/button'
import CircularProgress from './ui/circularProgress'
import { useShallow } from 'zustand/react/shallow'

export default function Microphone() {
  const { disableMicro } = useAppStore(
    useShallow((state) => ({
      disableMicro: state.disableMicro,
    }))
  )
  const { audioUrl, fullAudioUrl, isRecording, startRecording, stopRecording, getSpeechAssesment } =
    useAudioRecorder()

  const recordingAction = () => {
    if (!isRecording) return startRecording()
    return stopRecording()
  }

  const shapeBtn = isRecording ? 'h-24 w-24 rounded-3xl' : 'h-32 w-32 rounded-full'
  return (
    <section className="flex h-full flex-col items-center justify-center">
      <div className="relative h-full w-full gap-5">
        <div className="absolute inset-0 flex h-full w-full items-center justify-center">
          <Button
            onClick={recordingAction}
            disabled={disableMicro}
            className={`z-10 aspect-square ${shapeBtn} transition-all duration-500 ease-in-out`}
          />
        </div>

        <CircularProgress
          className="absolute inset-0"
          startTimer={isRecording}
          onResetTimer={stopRecording}
        />
      </div>

      <div className="hidden">
        <Button onClick={getSpeechAssesment}>Get Full Recording</Button>
        {isRecording && <h2 className="bg-red-500 p-4 text-white">Recording...</h2>}

        {fullAudioUrl && (
          <div>
            <h3>Full Recording</h3>
            <audio controls id="2">
              <source src={fullAudioUrl} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </section>
  )
}

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
  const { audioUrl, fullAudioUrl, isRecording, startRecording, stopRecording } = useAudioRecorder()

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
    </section>
  )
}

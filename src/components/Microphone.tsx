'use client'

import { useAppStore } from '@/store/zustand-store'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { Button } from './ui/button'
import CircularProgress from './ui/circularProgress'
import { useShallow } from 'zustand/react/shallow'
import useEvaluateConversation from './hooks/useEvaluateConversation'

export default function Microphone() {
  const { disableMicro } = useAppStore(
    useShallow((state) => ({
      disableMicro: state.disableMicro,
    }))
  )
  const { audioUrl, fullAudioUrl, isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { onEvaluate, responseCount } = useEvaluateConversation()
  const recordingAction = () => {
    if (!isRecording) return startRecording()
    return stopRecording()
  }

  const shapeBtn = isRecording
    ? 'lg:h-24 lg:w-24 h-16 w-16 rounded-3xl'
    : 'h-20 w-20 lg:h-32 lg:w-32 rounded-full'
  return (
    <section className="flex h-full flex-col items-center justify-start lg:justify-center">
      <div className="relative top-0 flex-col flex-wrap items-start justify-start gap-2 lg:top-48">
        <Button
          onClick={onEvaluate}
          className="my-0 line-clamp-1 py-0"
          disabled={responseCount < 5}
        >
          {responseCount}/5 responses to evaluate conversation
        </Button>
      </div>
      <div className="relative top-14 w-full gap-5">
        <div className="absolute inset-0 flex h-full w-full items-center justify-center">
          <Button
            onClick={recordingAction}
            disabled={disableMicro}
            className={`z-10 aspect-square bg-teal-700/70 ${shapeBtn} transition-all duration-500 ease-in-out`}
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

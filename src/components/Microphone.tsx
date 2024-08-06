'use client'

import { useAudioRecorder } from './hooks/useAudioRecorder'
import { Button } from './ui/button'
import useAiChat from './hooks/useAIChat'
import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react'
import { useTextToSpeech } from './hooks/useTextToSpeech'

export default function Microphone() {
  const { audioUrl, fullAudioUrl, isRecording, startRecording, stopRecording, getSpeechAssesment } =
    useAudioRecorder()
  const recordingAction = () => {
    if (!isRecording) return startRecording()
    return stopRecording()
  }
  return (
    <section>
      <section className="flex flex-col items-center justify-center gap-5">
        <Button onClick={recordingAction}>
          {isRecording ? <IconMicrophoneOff /> : <IconMicrophone />}
        </Button>
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
      </section>
    </section>
  )
}

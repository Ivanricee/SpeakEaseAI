'use client'
import { useEffect, useRef, useState } from 'react'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { Button } from './ui/button'
import { chatConversation } from '@/app/actions/openai'
import { readStreamableValue } from 'ai/rsc'
import { CoreMessage } from 'ai'
import { Menu } from './Menu'

export default function Microphone() {
  const { audioUrl, fullAudioUrl, isRecording, startRecording, stopRecording, getSpeechAssesment } = useAudioRecorder()
  const [conversation, setConversation] = useState<CoreMessage[]>([
    {
      role: 'assistant',
      content: 'Hi there! How are you today? Im excited to help you with ${tema} at a ${nivel} level. What would you like to start with?',
    },
  ])
  const askAi = async () => {
    const { messages, outputMsg } = await chatConversation({
      nivel: 'basico',
      tema: 'monstruos cosmicos',
      history: [...conversation, { role: 'user', content: 'hola' }],
      aditionalRole: 'experto en monstruos cosmicos miticos y otros',
    })
    console.log('output ', outputMsg)
    let textContent = ''
    for await (const text of readStreamableValue(outputMsg)) {
      textContent = `${textContent}${text}`
      console.log('textContent ', textContent)
      setConversation([...messages, { role: 'assistant', content: textContent }])
    }
  }
  const recordingAction = () => {
    if (!isRecording) return startRecording()
    return stopRecording()
  }
  return (
    <>
      <Menu />
      <section className="flex flex-col items-center justify-center gap-5">
        <Button onClick={recordingAction}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Button>
        <Button onClick={getSpeechAssesment}>Get Full Recording</Button>
        {isRecording && <h2 className="bg-red-500 p-4 text-white">Recording...</h2>}
        {audioUrl && (
          <div>
            <h3>Latest Recording</h3>
            <audio id="1" controls src={audioUrl}></audio>
          </div>
        )}

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
      <section>
        <div>
          <Button onClick={askAi}>Ask AI</Button>
          <div>
            {conversation.map((message, idx) => (
              <h2 key={idx}>
                {message.role}: {message.content as string}
              </h2>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

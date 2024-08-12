'use client'
import { useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'

export default function Chat() {
  const { conversation } = useAppStore(
    useShallow((state) => ({
      conversation: state.conversation,
    }))
  )

  return (
    <div>
      {conversation.map((message, idx) => (
        <div key={message.id}>
          <h2>
            {message.role}: {message.content as string}
          </h2>

          {message.url!.length > 0 && (
            <div>
              <audio controls id={message.id} autoPlay>
                <source src={message.url} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

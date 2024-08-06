import useAiChat from './hooks/useAIChat'

export default function Chat() {
  const { chatAi, conversation } = useAiChat()
  return (
    <div>
      {conversation.map((message, idx) => (
        <>
          <h2 key={idx}>
            {message.role}: {message.content as string}
          </h2>

          {message.id.length > 0 && (
            <div>
              <audio controls id="2">
                <source src={message.id} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </>
      ))}
    </div>
  )
}

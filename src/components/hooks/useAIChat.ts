import { useEffect } from 'react'
import { chatConversation } from '@/app/actions/openai'
import { readStreamableValue } from 'ai/rsc'
import { CoreMessage } from 'ai'
import { ExtendCoreMessage, useAppStore } from '@/store/zustand-store'
import { useTextToSpeech } from './useTextToSpeech'

type ChatAi = {
  userContent: string
  id: string
}
type returnHook = {
  chatAi: ({ userContent, id }: ChatAi) => Promise<void>
  conversation: ExtendCoreMessage[]
}
export default function useAiChat(): returnHook {
  const { getAudioFromText } = useTextToSpeech()
  const { chatSetup, openAiKey, setConversation, initConversation, conversation } = useAppStore(
    (state) => ({
      chatSetup: state.chatSetup,
      openAiKey: state.openAiKey.key,
      setConversation: state.setConversation,
      initConversation: state.initConversation,
      conversation: state.conversation,
    })
  )
  const tema = chatSetup.topic
  const nivel = chatSetup.level
  const aditionalRole = chatSetup.role
  const model = chatSetup.model
  const key = openAiKey || ''

  useEffect(() => {
    const initial = [
      {
        id: '',
        role: 'assistant',
        content: `Hi there! How are you today? Im excited to help you with ${tema} at a ${nivel} level. What would you like to start with?`,
      },
    ] as ExtendCoreMessage[]
    initConversation(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chatAi = async ({ userContent, id }: ChatAi) => {
    const { messages, outputMsg } = await chatConversation({
      model,
      key,
      nivel,
      tema,
      history: [...conversation, { id, role: 'user', content: userContent }],
      aditionalRole,
    })
    let textContent = ''
    for await (const text of readStreamableValue(outputMsg)) {
      textContent = `${textContent}${text}`
      setConversation({ messages, textContent, id: '' })
    }
    const url = await getAudioFromText({ message: textContent })
    if (url) setConversation({ messages, textContent, id: url })
    console.log('url', url)
  }

  return { chatAi, conversation }
}

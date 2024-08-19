'use client'

import { useEffect } from 'react'
import { chatConversation } from '@/app/actions/openai'
import { readStreamableValue } from 'ai/rsc'
import { ExtendCoreMessage, useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'
import { useTextToSpeech } from './useTextToSpeech'

type ChatAi = {
  userContent: string
  id: string
  urlUsr: string
}
type returnHook = {
  chatAi: ({ userContent, id }: ChatAi) => Promise<void>
  conversation: ExtendCoreMessage[]
}
export default function useAiChat(): returnHook {
  const { getAudioFromText } = useTextToSpeech()
  const { chatSetup, openAiKey, setConversation, initConversation, conversation, setDisableMicro } =
    useAppStore(
      useShallow((state) => ({
        chatSetup: state.chatSetup,
        openAiKey: state.openAiKey.key,
        setConversation: state.setConversation,
        initConversation: state.initConversation,
        conversation: state.conversation,
        setDisableMicro: state.setDisableMicro,
      }))
    )
  const tema = chatSetup.topic
  const nivel = chatSetup.level
  const aditionalRole = chatSetup.role
  const model = chatSetup.model
  const key = openAiKey || ''

  useEffect(() => {
    const initial = [
      {
        id: 'start',
        role: 'assistant',
        content: `Hi there! How are you today? Im excited to help you with ${tema} at a ${nivel} level. What would you like to start with?`,
        url: '',
      },
    ] as ExtendCoreMessage[]
    initConversation(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const stringId = Date.now().toString()
  const chatAi = async ({ userContent, id, urlUsr }: ChatAi) => {
    const { messages, outputMsg } = await chatConversation({
      model,
      key,
      nivel,
      tema,
      history: [
        ...conversation,
        { id, role: 'user', content: userContent, url: urlUsr, idAssesment: id },
      ],
      aditionalRole,
    })
    let textContent = ''
    for await (const text of readStreamableValue(outputMsg)) {
      textContent = `${textContent}${text}`
      setConversation({ messages, textContent, id: stringId, url: '' })
    }
    const url = await getAudioFromText({ message: textContent })
    if (url) setConversation({ messages, textContent, url, id: stringId })

    await setDisableMicro(false)
  }

  return { chatAi, conversation }
}

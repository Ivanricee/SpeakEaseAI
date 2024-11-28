'use client'

import { useEffect } from 'react'
import { chatConversation } from '@/app/actions/openai'
import { ExtendCoreMessage, useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'
import { useTextToSpeech } from './useTextToSpeech'
import { streamValueToObject } from '@/utils/app'

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
  const {
    chatSetup,
    openAiKey,
    setUserConversation,
    setAssistantConversation,
    initConversation,
    conversation,
    setDisableMicro,
  } = useAppStore(
    useShallow((state) => ({
      chatSetup: state.chatSetup,
      openAiKey: state.openAiKey.key,
      setUserConversation: state.setUserConversation,
      setAssistantConversation: state.setAssistantConversation,
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
        content: `Hi there! Im excited to help you with ${tema} at a ${nivel} level. Let’s get started! How are you today?`,
        url: '',
        idAssesment: null,
      },
    ] as ExtendCoreMessage[]
    initConversation(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const stringId = Date.now().toString()
  const chatAi = async ({ userContent, id, urlUsr }: ChatAi) => {
    // ----  User chat history -----
    await setUserConversation({
      id,
      textContent: userContent,
      url: urlUsr,
      idAssesment: null,
    })

    //----  Assistant chat history -----
    const chatProps = {
      model,
      key,
      nivel,
      tema,
      history: [
        ...conversation,
        { id, role: 'user', content: userContent, url: urlUsr, idAssesment: id },
      ] as ExtendCoreMessage[],
      aditionalRole,
    }
    const { outputMsg: streamValueMsg } = await chatConversation(chatProps)
    // process stream value
    let chatResponseJSON: {
      [key: string]: string
    } = {
      languageEnhancementFeedback: '',
      topicCorrection: '',
      contextualFollowUpQuestion: '',
    }
    const partialJSON = { ...chatResponseJSON }
    const setStreamObject = async (partialJSON: { [key: string]: string }) => {
      await setAssistantConversation({
        textContent: JSON.stringify(partialJSON),
        id: stringId,
      })
    }
    setStreamObject(partialJSON)
    const resultJSON = await streamValueToObject({ partialJSON, setStreamObject, streamValueMsg })
    if (resultJSON) {
      // process stream value
      const stringContentJson = JSON.stringify(resultJSON)

      // get text from response
      const ttsResponse = `
    ${resultJSON.languageEnhancementFeedback}.
    ${resultJSON.topicCorrection}.
    ${resultJSON.contextualFollowUpQuestion}.
    `
      const url = await getAudioFromText({ message: ttsResponse })
      if (url) {
        await setAssistantConversation({
          textContent: stringContentJson,
          id: stringId,
          url,
        })
      }
    }

    await setDisableMicro(false)
  }

  return { chatAi, conversation }
}

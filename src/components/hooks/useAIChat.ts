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
        content: `Hi there! How are you today? Im excited to help you with ${tema} at a ${nivel} level. What would you like to start with?`,
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
    const { outputMsg } = await chatConversation(chatProps)
    // process stream value
    let currentKey = ''
    let accumulatedContent = ''
    let partialJSON: {
      [key: string]: string
    } = {
      languageEnhancementFeedback: '',
      topicCorrection: '',
      contextualFollowUpQuestion: '',
    }
    await setAssistantConversation({
      textContent: JSON.stringify(partialJSON),
      id: stringId,
    })
    const keys = Object.keys(partialJSON)
    for await (const text of readStreamableValue(outputMsg)) {
      accumulatedContent += text

      for (const key of keys) {
        if (accumulatedContent.includes(key)) {
          currentKey = key
          // Reset to remove key from accumulated
          accumulatedContent = ''
          break
        }
      }
      if (currentKey.length > 0) {
        partialJSON[currentKey] = accumulatedContent.replace(/"\s*,|}|\s*"/g, '')
        await setAssistantConversation({
          textContent: JSON.stringify(partialJSON),
          id: stringId,
        })
      }
    }
    // process stream value
    const stringContentJson = JSON.stringify(partialJSON)

    // get text from response
    const ttsResponse = `
    ${partialJSON.languageEnhancementFeedback}.
    ${partialJSON.topicCorrection}.
    ${partialJSON.contextualFollowUpQuestion}.
    `
    const url = await getAudioFromText({ message: ttsResponse })
    if (url) {
      await setAssistantConversation({
        textContent: stringContentJson,
        id: stringId,
        url,
      })
    }

    await setDisableMicro(false)
  }

  return { chatAi, conversation }
}

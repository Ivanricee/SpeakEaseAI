/* eslint-disable max-len */
'use client'

import { useAppStore } from '@/store/zustand-store'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { useEffect, useMemo, useRef } from 'react'
import { debounce } from '@/utils/app'
import AudioWave from './AudioWave'
import SpeechAssessmentResult from './SpeechAssessmentResult'
import ChatCardContent from './ChatCardContent'

export default function Chat() {
  const refContainer = useRef<HTMLDivElement>(null)

  const { conversation, isAzureEnabled } = useAppStore((state) => ({
    conversation: state.conversation,
    isAzureEnabled: state.azureKey.isEnable,
  }))

  const debouncedScroll = useMemo(
    () =>
      debounce({
        callback: () => {
          const chatContainer = refContainer.current
          if (chatContainer) {
            const isAtBottom =
              Math.ceil(chatContainer.scrollTop + chatContainer.clientHeight + 30) >=
              chatContainer.scrollHeight

            if (!isAtBottom) {
              chatContainer.scrollTop = chatContainer.scrollHeight
            }
          }
        },
        delay: 300,
      }),
    []
  )
  useEffect(() => {
    debouncedScroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation])

  return (
    <div
      className="scrollbar-none flex h-full flex-col gap-4 overflow-y-auto scroll-smooth p-0 font-pontanoSans md:p-4"
      ref={refContainer}
    >
      {conversation.map((message) => {
        const isNotIntroMsg = message.id !== 'start'
        const isUser = message.role === 'user'
        const position = isUser ? '  sm:justify-end ' : 'justify-start'
        const bg = isUser ? ' text-stone-950' : 'bg-card'
        const textContent = isUser ? 'text-stone-800' : 'text-primary'
        const contentObj = !isUser && isNotIntroMsg ? JSON.parse(message.content) : null

        return (
          <div key={message.id} className={`flex w-full animate-in ${position} `}>
            <Card
              className={`w-full font-pontanoSans sm:w-11/12 md:w-5/6 ${bg} min-w-[21.5rem] border-4 border-primary bg-[url('/images/cards.webp')] bg-cover bg-center bg-no-repeat bg-blend-color-burn`}
            >
              <CardHeader className="p-2 pb-2">
                <CardTitle className="px-4 text-left">{message.role}</CardTitle>
                <Separator orientation="horizontal" className="flex p-0" />
                {isNotIntroMsg && <AudioWave url={message.url} dark={isUser} autoPlay={!isUser} />}
                {isNotIntroMsg && <Separator orientation="horizontal" className="my-2 flex" />}
              </CardHeader>
              <CardContent className={`p-2 pt-0 ${textContent} font-pontanoSans`}>
                <ChatCardContent
                  contentObj={contentObj}
                  idAssesment={message.idAssesment}
                  textContent={message.content}
                />
              </CardContent>
              {isUser && isAzureEnabled && (
                <CardFooter className="flex animate-typingFade flex-col p-2 pt-0">
                  <Separator orientation="horizontal" className="my-2 flex bg-primary/10" />
                  <SpeechAssessmentResult idAssessment={message.idAssesment} />
                </CardFooter>
              )}
            </Card>
          </div>
        )
      })}
    </div>
  )
}

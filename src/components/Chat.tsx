'use client'

import { useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { useEffect, useMemo, useRef } from 'react'
import { debounce } from '@/utils/app'
import AudioWave from './AudioWave'
import WordAssessment from './WordAssessment'
import SpeechAssessmentResult from './SpeechAssessmentResult'

export default function Chat() {
  const refContainer = useRef<HTMLDivElement>(null)

  const { conversation, isAzureEnabled } = useAppStore(
    useShallow((state) => ({
      conversation: state.conversation,
      isAzureEnabled: state.azureKey.isEnable,
    }))
  )

  const debouncedScroll = useMemo(
    () =>
      debounce({
        callback: () => {
          if (refContainer.current) {
            refContainer.current.scrollTop = refContainer.current.scrollHeight
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
      className="scrollbar-none flex h-full flex-col gap-4 overflow-y-auto scroll-smooth p-0 font-robotoSlab md:p-4"
      ref={refContainer}
    >
      {conversation.map((message) => {
        const isNotIntroMsg = message.id !== 'start'
        const isUser = message.role === 'user'
        const position = isUser ? 'justify-end' : 'justify-start'
        const bg = isUser ? 'bg-[#73bda8]/80 text-stone-950' : 'bg-stone-900'
        const textContent = isUser ? 'text-stone-800' : 'text-muted-foreground'

        return (
          <div key={message.id} className={`flex w-full animate-in ${position}`}>
            <Card className={`w-5/6 font-kadwa ${bg}`}>
              <CardHeader className="p-2 pb-2">
                <CardTitle>{message.role}</CardTitle>
                {isNotIntroMsg && <AudioWave url={message.url} dark={isUser} autoPlay={!isUser} />}
                <Separator orientation="horizontal" className="top-2 flex" />
              </CardHeader>
              <CardContent className={`p-2 pt-0 font-robotoSlab ${textContent} `}>
                <div>
                  {message.idAssesment ? (
                    <WordAssessment idAssessment={message.idAssesment} />
                  ) : (
                    <span className="text-sm"> {message.content}</span>
                  )}
                </div>
              </CardContent>
              {isUser && isAzureEnabled && (
                <CardFooter className="flex flex-col p-2 pt-0 font-robotoSlab animate-in">
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

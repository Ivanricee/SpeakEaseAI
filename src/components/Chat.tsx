'use client'

import WavesurferPlayer, { WavesurferProps } from '@wavesurfer/react'
import { useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { useEffect, useMemo, useRef } from 'react'
import { debounce } from '@/utils/app'
import AudioWave from './AudioWave'
import WordAssessment from './WordAssessment'
import { AssesmentWord } from '@/types/assesmentResult'
import {
  IconCheck,
  IconCheckbox,
  IconMusic,
  IconPuzzle,
  IconSpeakerphone,
  IconTimeline,
  IconX,
} from '@tabler/icons-react'

export default function Chat() {
  const refContainer = useRef<HTMLDivElement>(null)

  const { conversation, assessmentResult } = useAppStore(
    useShallow((state) => ({
      conversation: state.conversation,
      assessmentResult: state.assessmentResult,
    }))
  )
  console.log('conversation', conversation)

  assessmentResult.forEach((value, key) => {
    console.log('-----------key', { value, key })
  })

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
      {conversation.map((message, idx) => {
        const userAssesmnt = message.idAssesment ? assessmentResult.get(message.idAssesment) : null

        const hasUrlFile =
          message.url!.length > 0 &&
          (message.url.startsWith('blob:') || message.url.startsWith('http'))
        const isUser = message.role === 'user'
        const position = isUser ? 'justify-end' : 'justify-start'
        const bg = isUser ? 'bg-[#73bda8]/80 text-stone-950' : 'bg-stone-900'
        const textContent = isUser ? 'text-stone-800' : 'text-muted-foreground'

        return (
          <div key={message.id} className={`flex w-full ${position}`}>
            <Card className={`w-5/6 font-kadwa ${bg}`}>
              <CardHeader className="p-2 pb-2">
                <CardTitle>{message.role}</CardTitle>
                {hasUrlFile && <AudioWave url={message.url} dark={isUser} />}
                <Separator orientation="horizontal" className="top-2 flex" />
              </CardHeader>
              <CardContent className={`p-2 pt-0 font-robotoSlab ${textContent} `}>
                <div>
                  {userAssesmnt ? (
                    userAssesmnt.Words.map((word, idx) => <WordAssessment word={word} key={idx} />)
                  ) : (
                    <span className="text-sm"> {message.content}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col p-2 pt-0 font-robotoSlab">
                {userAssesmnt && (
                  <>
                    <Separator orientation="horizontal" className="inset-0 my-2 flex" />
                    <div className="flex w-full items-center justify-center gap-2">
                      <div className="flex flex-col rounded-md border-2 border-stone-900 p-1">
                        <p className="flex flex-nowrap items-center gap-0.5">
                          {userAssesmnt.PronunciationAssessment.AccuracyScore === 0 ? (
                            <IconX />
                          ) : (
                            <IconCheck />
                          )}
                          {userAssesmnt.PronunciationAssessment.AccuracyScore}%
                        </p>
                        <h6 className="font-kadwa text-[0.7rem] font-bold">Accuracy </h6>
                      </div>
                      <div className="flex flex-col items-center rounded-md border-2 border-stone-900 p-1">
                        <p className="flex flex-nowrap items-center gap-0.5">
                          <IconPuzzle /> {userAssesmnt.PronunciationAssessment.CompletenessScore}%
                        </p>
                        <h6 className="font-kadwa text-[0.7rem] font-bold">Completeness </h6>
                      </div>

                      <div className="flex flex-col items-center rounded-md border-2 border-stone-900 p-1">
                        <p className="flex flex-nowrap items-center gap-0.5">
                          <IconTimeline /> {userAssesmnt.PronunciationAssessment.FluencyScore}%
                        </p>
                        <h6 className="font-kadwa text-[0.7rem] font-bold">Fluency </h6>
                      </div>
                      <div className="flex flex-col items-center rounded-md border-2 border-stone-900 p-1">
                        <p className="flex flex-nowrap items-center gap-0.5">
                          <IconSpeakerphone /> {userAssesmnt.PronunciationAssessment.PronScore}%
                        </p>
                        <h6 className="font-kadwa text-[0.7rem] font-bold">Pronunciation </h6>
                      </div>
                      <div className="flex flex-col items-center rounded-md border-2 border-stone-900 p-1">
                        <p className="flex flex-nowrap items-center gap-0.5">
                          <IconMusic /> {userAssesmnt.PronunciationAssessment.ProsodyScore}%
                        </p>
                        <h6 className="font-kadwa text-[0.7rem] font-bold">Prosody </h6>
                      </div>
                    </div>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

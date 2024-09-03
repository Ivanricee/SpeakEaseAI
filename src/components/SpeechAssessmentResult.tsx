import { useAppStore } from '@/store/zustand-store'
import { Separator } from '@radix-ui/react-separator'
import {
  IconCheck,
  IconMusic,
  IconPuzzle,
  IconSpeakerphone,
  IconTimeline,
  IconX,
} from '@tabler/icons-react'
import { useShallow } from 'zustand/react/shallow'
import { Skeleton } from './ui/skeleton'

interface Props {
  idAssessment: string | null
}
export default function SpeechAssessmentResult({ idAssessment }: Props) {
  const { assessmentResult } = useAppStore(
    useShallow((state) => ({
      assessmentResult: state.assessmentResult,
    }))
  )
  const userAssesmnt = idAssessment ? assessmentResult.get(idAssessment) : null
  return (
    <>
      {userAssesmnt ? (
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
          <h6 className="mt-1 font-kadwa text-[0.6rem]">
            confidence: {userAssesmnt.Confidence.toFixed(2)}/1
          </h6>
        </>
      ) : (
        <ResultSkeleton />
      )}
    </>
  )
}

function ResultSkeleton() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <div className="flex flex-col rounded-md border-2 border-stone-900 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-8" />
        </p>
        <h6 className="font-kadwa text-[0.7rem] font-bold">Accuracy </h6>
      </div>
      <div className="flex flex-col items-center rounded-md border-2 border-stone-900 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-8" />
        </p>
        <h6 className="font-kadwa text-[0.7rem] font-bold">Completeness </h6>
      </div>

      <div className="flex flex-col items-center rounded-md border-2 border-stone-900 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-7" />
        </p>
        <h6 className="font-kadwa text-[0.7rem] font-bold">Fluency </h6>
      </div>
      <div className="flex flex-col items-center rounded-md border-2 border-stone-900 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-8" />
        </p>
        <h6 className="font-kadwa text-[0.7rem] font-bold">Pronunciation </h6>
      </div>
      <div className="flex flex-col items-center rounded-md border-2 border-stone-900 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-6 w-7" />
          <Skeleton className="h-6 w-9" />
        </p>
        <h6 className="font-kadwa text-[0.7rem] font-bold">Prosody </h6>
      </div>
    </div>
  )
}

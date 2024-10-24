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
import { ScoreProgress } from './ui/scoreProgress'

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
        <div className="w-full overflow-x-auto rounded-b-lg">
          <div className="flex w-full min-w-[28rem] items-center justify-center gap-2 font-archivoNarrow text-stone-900">
            <div className="flex flex-col rounded-md border-2 border-primary/90 bg-primary/5 p-1 text-center">
              <p className="flex flex-nowrap items-center gap-0.5 text-[0.9rem]">
                {Math.floor(userAssesmnt.PronunciationAssessment.AccuracyScore)}%
                <ScoreProgress score={userAssesmnt.PronunciationAssessment.AccuracyScore}>
                  {userAssesmnt.PronunciationAssessment.AccuracyScore === 0 ? (
                    <IconX size={20} className="text-stone-900" />
                  ) : (
                    <IconCheck size={20} className="text-stone-900" />
                  )}
                </ScoreProgress>
              </p>
              <h6 className="font-pontanoSans text-[0.77rem] font-bold">Accuracy </h6>
            </div>

            <div className="flex flex-col items-center rounded-md border-2 border-primary/90 bg-primary/5 p-1">
              <p className="flex flex-nowrap items-center gap-0.5 text-[0.9rem]">
                {Math.floor(userAssesmnt.PronunciationAssessment.CompletenessScore)}%
                <ScoreProgress score={userAssesmnt.PronunciationAssessment.CompletenessScore}>
                  <IconPuzzle size={17} className="text-stone-900" />
                </ScoreProgress>
              </p>
              <h6 className="font-pontanoSans text-[0.77rem] font-bold">Completeness </h6>
            </div>

            <div className="flex flex-col items-center rounded-md border-2 border-primary/90 bg-primary/5 p-1">
              <p className="flex flex-nowrap items-center gap-0.5 text-[0.9rem]">
                {Math.floor(userAssesmnt.PronunciationAssessment.FluencyScore)}%
                <ScoreProgress score={userAssesmnt.PronunciationAssessment.FluencyScore}>
                  <IconTimeline size={20} className="text-stone-900" />
                </ScoreProgress>
              </p>
              <h6 className="font-pontanoSans text-[0.77rem] font-bold">Fluency </h6>
            </div>
            <div className="flex flex-col items-center rounded-md border-2 border-primary/90 bg-primary/5 p-1">
              <p className="flex flex-nowrap items-center gap-0.5 text-[0.9rem]">
                {Math.floor(userAssesmnt.PronunciationAssessment.PronScore)}%
                <ScoreProgress score={userAssesmnt.PronunciationAssessment.PronScore}>
                  <IconSpeakerphone size={19} className="text-stone-900" />
                </ScoreProgress>
              </p>
              <h6 className="font-pontanoSans text-[0.77rem] font-bold">Pronunciation </h6>
            </div>
            <div className="flex flex-col items-center rounded-md border-2 border-primary/90 bg-primary/5 p-1">
              <p className="flex flex-nowrap items-center gap-0.5 text-[0.9rem]">
                {Math.floor(userAssesmnt.PronunciationAssessment.ProsodyScore)}%
                <ScoreProgress score={userAssesmnt.PronunciationAssessment.ProsodyScore}>
                  <IconMusic size={19} className="text-stone-900" />
                </ScoreProgress>
              </p>
              <h6 className="font-pontanoSans text-[0.77rem] font-bold">Prosody </h6>
            </div>
          </div>
          <h6 className="mt-1 text-center font-pontanoSans text-[0.7rem]">
            confidence: {userAssesmnt.Confidence.toFixed(2)}/1
          </h6>
        </div>
      ) : (
        <span>
          <ResultSkeleton />
        </span>
      )}
    </>
  )
}

function ResultSkeleton() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <div className="flex flex-col justify-center rounded-md border-2 border-primary/90 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-5 w-8 rounded bg-primary/50" />
          <Skeleton className="h-7 w-7 rounded-full bg-primary/70" />
        </p>
        <h6 className="font-pontanoSans text-[0.77rem] font-bold">Accuracy </h6>
      </div>
      <div className="flex flex-col items-center rounded-md border-2 border-primary/90 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-5 w-6 rounded bg-primary/50" />
          <Skeleton className="h-7 w-8 rounded-full bg-primary/70" />
        </p>
        <h6 className="font-pontanoSans text-[0.77rem] font-bold">Completeness </h6>
      </div>

      <div className="flex flex-col items-center rounded-md border-2 border-primary/90 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-5 w-8 rounded bg-primary/50" />
          <Skeleton className="h-7 w-7 rounded-full bg-primary/70" />
        </p>
        <h6 className="font-pontanoSans text-[0.77rem] font-bold">Fluency </h6>
      </div>
      <div className="flex flex-col items-center rounded-md border-2 border-primary/90 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-5 w-6 rounded bg-primary/50" />
          <Skeleton className="h-7 w-7 rounded-full bg-primary/70" />
        </p>
        <h6 className="font-pontanoSans text-[0.77rem] font-bold">Pronunciation </h6>
      </div>
      <div className="flex flex-col items-center justify-center rounded-md border-2 border-primary/90 p-1">
        <p className="flex flex-nowrap items-center gap-0.5">
          <Skeleton className="h-5 w-7 rounded bg-primary/50" />
          <Skeleton className="h-7 w-7 rounded-full bg-primary/70" />
        </p>
        <h6 className="font-pontanoSans text-[0.77rem] font-bold">Prosody </h6>
      </div>
    </div>
  )
}

import { AssesmentWord } from '@/types/assesmentResult'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import { useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'

interface WordSyllablesProps {
  word: string
  syllables: AssesmentWord['Syllables']
  accuracy: number
}
const accuracyColors = [
  'text-red-600',
  'text-orange-600',
  'text-yellow-600',
  'text-lime-600',
  'text-green-400',
  'text-green-600',
]
const accuracyBColors = [
  'border-red-600',
  'border-orange-600',
  'border-yellow-600',
  'border-lime-600',
  'border-green-400',
  'border-green-600',
]
function getAccuracyColor(accuracy: number, isText: boolean = true) {
  if (accuracy === 100) return isText ? accuracyColors[5] : accuracyBColors[5]
  const index = Math.floor(accuracy / 20)
  return isText ? accuracyColors[index] : accuracyBColors[index]
}
const WordSyllables = ({ word, syllables, accuracy }: WordSyllablesProps) => {
  const borderColor = getAccuracyColor(accuracy, false)

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span
            className={`cursor-pointer border-b-4 ${borderColor} font-robotoSlab text-sm font-normal text-stone-800`}
          >
            {`${word} `}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {syllables.map((syllable, idx) => {
              const textColor = getAccuracyColor(syllable.PronunciationAssessment.AccuracyScore)
              return (
                <span
                  key={idx}
                  className={`capitalize ${textColor}`}
                >{`${syllable.Syllable} `}</span>
              )
            })}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface wordAssessmentProps {
  //word: AssesmentWord
  idAssessment: string | null
}
export default function WordAssessment({ idAssessment }: wordAssessmentProps) {
  const { assessmentResult } = useAppStore(
    useShallow((state) => ({
      assessmentResult: state.assessmentResult,
    }))
  )
  const userAssessmnt = idAssessment ? assessmentResult.get(idAssessment) : null

  return (
    <>
      {userAssessmnt?.Words.map((word, idx) => {
        const {
          Word,
          Syllables,
          PronunciationAssessment: { AccuracyScore },
        } = word
        return (
          <WordSyllables key={idx} word={Word} syllables={Syllables} accuracy={AccuracyScore} />
        )
      })}
    </>
  )
}

import { AssesmentWord } from '@/types/assesmentResult'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { LowScoredWord, useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'
import { useEffect } from 'react'

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
  'border-red-600/65',
  'border-orange-600/65',
  'border-yellow-600/65',
  'border-lime-600/65',
  'border-green-400/65',
  'border-green-600/65',
]
function getAccuracyColor(accuracy: number, isText: boolean = true) {
  if (accuracy === 100) return isText ? accuracyColors[5] : accuracyBColors[5]
  const index = Math.floor(accuracy / 20)
  return isText ? accuracyColors[index] : accuracyBColors[index]
}
const WordSyllables = ({ word, syllables, accuracy }: WordSyllablesProps) => {
  const { setLowScoredWord } = useAppStore((state) => ({
    setLowScoredWord: state.setLowScoredWord,
  }))
  const borderColor = getAccuracyColor(accuracy, false)
  useEffect(() => {
    // store low scored words
    if (accuracy <= 70) {
      let newLowScoredWord: LowScoredWord = { word, score: accuracy, phonemes: [] }
      syllables.map((syllable) => {
        return newLowScoredWord.phonemes.push({
          syllable: syllable.Syllable,
          score: syllable.PronunciationAssessment.AccuracyScore,
        })
      })
      setLowScoredWord(newLowScoredWord)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span
            className={`ml-0.5 cursor-pointer rounded border-2 px-0.5 ${borderColor} `}
          >{`${word} `}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-primary">
          <p>
            {syllables.map((syllable, idx) => {
              const textColor = getAccuracyColor(syllable.PronunciationAssessment.AccuracyScore)
              return (
                <span
                  key={idx}
                  className={`capitalize ${textColor} text-base font-bold`}
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
    <div className="text-base font-semibold">
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
    </div>
  )
}

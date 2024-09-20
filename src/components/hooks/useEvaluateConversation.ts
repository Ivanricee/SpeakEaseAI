import { useAppStore } from '@/store/zustand-store'
import { useShallow } from 'zustand/react/shallow'

export default function useEvaluateConversation() {
  const { conversation, lowScoredWords, assessmentResult } = useAppStore(
    useShallow((state) => ({
      conversation: state.conversation,
      lowScoredWords: state.lowScoredWords,
      assessmentResult: Array.from(state.assessmentResult),
    }))
  )
  const responseCount = conversation.filter((item) => item.role === 'user').length
  const getLowScoredWords = () => {
    let strLowScoredWords = ''
    let idx = 1
    for (const word of lowScoredWords) {
      if (idx > 10) break
      strLowScoredWords += `${idx}: word: "${word.word}" score: ${word.score}%, phonemes score: `
      word.phonemes.forEach((phoneme) => {
        strLowScoredWords += `(${phoneme.syllable}: ${phoneme.score}%). `
      })
      idx++
    }
    console.log({ strLowScoredWords })
    return strLowScoredWords
  }
  const getWorsePhrases = () => {
    let strPhrases = ''
    let idx = 1
    console.log({ assessmentResult })

    assessmentResult.sort((a, b) => {
      const scoreA = a[1].PronunciationAssessment
      const scoreB = b[1].PronunciationAssessment

      // Comparar por AccuracyScore primero
      if (scoreA.AccuracyScore !== scoreB.AccuracyScore) {
        return scoreA.AccuracyScore - scoreB.AccuracyScore // De menor a mayor
      }

      // Si son iguales, comparar por CompletenessScore
      if (scoreA.CompletenessScore !== scoreB.CompletenessScore) {
        return scoreA.CompletenessScore - scoreB.CompletenessScore
      }

      // Comparar por FluencyScore
      if (scoreA.FluencyScore !== scoreB.FluencyScore) {
        return scoreA.FluencyScore - scoreB.FluencyScore
      }

      // Comparar por PronScore
      if (scoreA.PronScore !== scoreB.PronScore) {
        return scoreA.PronScore - scoreB.PronScore
      }

      // Comparar por ProsodyScore
      return scoreA.ProsodyScore - scoreB.ProsodyScore
    })
    for (const phrase of assessmentResult) {
      if (idx >= 3) break

      strPhrases += `${idx}: ${phrase[1].Display}
      Accuracy: ${phrase[1].PronunciationAssessment.AccuracyScore}%,
      Completeness: ${phrase[1].PronunciationAssessment.CompletenessScore}%,
      Fluency: ${phrase[1].PronunciationAssessment.FluencyScore}%,
      Pronounciation: ${phrase[1].PronunciationAssessment.PronScore}%,
      Prosody: ${phrase[1].PronunciationAssessment.ProsodyScore}%. `
      idx++
    }
    console.log({ strPhrases })
    return strPhrases
  }
  const onEvaluate = () => {
    if (assessmentResult.length !== 0) {
      getLowScoredWords()
      getWorsePhrases()
    }
    console.log('onEvaluate')
  }
  return { onEvaluate, responseCount }
}

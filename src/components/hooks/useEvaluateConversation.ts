import { evaluateSpeech } from '@/app/actions/openai'
import { initEvalResult, useAppStore } from '@/store/zustand-store'
import { EvaluationResult } from '@/types/assesmentResult'
import { streamValueToObject } from '@/utils/app'
import { useShallow } from 'zustand/react/shallow'

export default function useEvaluateConversation() {
  const { conversation, lowScoredWords, assessmentResult, model, openAiKey, setEvaluationResult } =
    useAppStore(
      useShallow((state) => ({
        model: state.chatSetup.model,
        openAiKey: state.openAiKey.key,
        conversation: state.conversation,
        lowScoredWords: state.lowScoredWords,
        assessmentResult: Array.from(state.assessmentResult),
        setEvaluationResult: state.setEvaluationResult,
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
  const onEvaluate = async () => {
    if (assessmentResult.length === 0) return
    const words = getLowScoredWords()
    const conversations = getWorsePhrases()

    //get data from openai
    const key = openAiKey || ''
    const Props = {
      model,
      key,
      words,
      conversations,
    }
    const { outputMsg: streamValueMsg } = await evaluateSpeech(Props)
    // process stream value--------------------------------------------------
    const setStreamObject = async (partialJSON: EvaluationResult | { [key: string]: string }) => {
      console.log('partialJSON', { partialJSON })
      setEvaluationResult({ partialJSON: partialJSON as EvaluationResult })
    }
    let partialJSON = structuredClone(initEvalResult)
    await streamValueToObject({
      partialJSON: partialJSON as EvaluationResult,
      setStreamObject,
      isEval: true,
      streamValueMsg,
    })

    //await setDisableMicro(false)-----------------------------------------------------------
    //-----------------
    console.log('onEvaluate')
  }
  return { onEvaluate, responseCount }
}

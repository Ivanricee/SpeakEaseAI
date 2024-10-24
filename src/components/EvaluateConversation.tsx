/* eslint-disable max-len */
import { useAppStore } from '@/store/zustand-store'
import useEvaluateConversation from './hooks/useEvaluateConversation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

export default function EvaluateConversation() {
  const { evaluationResult } = useAppStore((state) => ({
    evaluationResult: state.evaluationResult,
  }))
  const { onEvaluate, responseCount } = useEvaluateConversation()
  const accuracy = evaluationResult.evConversations.evAccuracy
  const completeness = evaluationResult.evConversations.evCompleteness
  const fluency = evaluationResult.evConversations.evFluency
  const spelling = evaluationResult.evConversations.evSpelling

  const phonemes = evaluationResult.evWords.evProblematicPhonemes
  const errorPatterns = evaluationResult.evWords.evErrorPatterns
  const areasForImprovement = evaluationResult.evWords.evAreasForImprovement
  const feedback = evaluationResult.evGeneralSuggestions
  const englishLevel = evaluationResult.evEstimatedLevel
  const hasConversation = `${accuracy}${completeness}${fluency}${spelling}`
  const hasLexical = `${phonemes}${errorPatterns}${areasForImprovement}`
  const hasData = `${hasConversation}${hasLexical}${feedback}${englishLevel}`
  const getEnglishLvl = (level: string) => {
    const engLevels: Record<string, string> = {
      a1: 'Beginner',
      a2: 'Elementary',
      b1: 'Intermediate',
      b2: 'Upper Intermediate',
      c1: 'Advanced',
      c2: 'Proficient',
    }
    return engLevels[level.toLowerCase()] ?? ''
  }
  return (
    <Card className="h-full overflow-y-auto border-4 border-primary bg-[url('/images/cards.webp')] bg-cover bg-center bg-no-repeat bg-blend-color-burn">
      <CardHeader>
        <CardTitle>Speech Evaluation Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hasData.length === 0 ? (
          <div>
            <h2 className="font-archivoNarrow text-lg text-primary/90">
              You need to complete 10 responses to evaluate your conversation.
            </h2>
            <div className="flex items-center justify-center py-4">
              <Button
                onClick={onEvaluate}
                className="my-0 line-clamp-1 py-0"
                disabled={responseCount < 5}
              >
                {responseCount}/5 responses to evaluate conversation
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {englishLevel.length > 0 && (
              <div className="mb-4 flex w-full items-center justify-center">
                <div className="rounded-md border-4 border-primary/80 p-2">
                  <h2 className="text-center font-anton text-4xl font-bold uppercase text-primary">
                    {englishLevel}
                  </h2>
                  <p className="inline animate-typingFade text-balance text-foreground/80 delay-500">
                    {getEnglishLvl(englishLevel)}
                  </p>
                </div>
              </div>
            )}
            {feedback.length > 0 && (
              <div className="pb-2 font-pontanoSans text-base font-semibold">
                <p className="inline animate-typingFade text-balance text-foreground/80 delay-500">
                  {feedback}
                </p>
              </div>
            )}
            {hasConversation.length > 0 && (
              <>
                <h2 className="mb-2 font-archivoNarrow text-2xl uppercase text-primary">
                  Conversation
                </h2>
                {accuracy.length > 0 && (
                  <div className="pb-2 font-pontanoSans text-base font-semibold">
                    <h3 className="inline-block font-archivoNarrow text-lg uppercase italic text-primary">
                      Accuracy:
                    </h3>{' '}
                    <p className="inline animate-typingFade text-balance text-foreground/80 delay-500">
                      {accuracy}
                    </p>
                  </div>
                )}
                {completeness.length > 0 && (
                  <div className="pb-2 font-pontanoSans text-base font-semibold">
                    <h3 className="inline-block font-archivoNarrow text-lg uppercase italic text-primary">
                      Completeness:
                    </h3>{' '}
                    <p className="inline text-foreground/80">{completeness}</p>
                  </div>
                )}
                {fluency.length > 0 && (
                  <div className="pb-2 font-pontanoSans text-base font-semibold">
                    <h3 className="inline-block font-archivoNarrow text-lg uppercase italic text-primary">
                      Fluency:
                    </h3>{' '}
                    <p className="inline animate-typingFade text-balance text-foreground/80 delay-500">
                      {fluency}
                    </p>
                  </div>
                )}
                {spelling.length > 0 && (
                  <div className="pb-2 font-pontanoSans text-base font-semibold">
                    <h3 className="inline-block font-archivoNarrow text-lg uppercase italic text-primary">
                      Spelling:
                    </h3>{' '}
                    <p className="inline animate-typingFade text-balance text-foreground/80 delay-500">
                      {spelling}
                    </p>
                  </div>
                )}
              </>
            )}
            {hasLexical.length > 0 && (
              <>
                <h2 className="my-2 font-archivoNarrow text-2xl uppercase text-primary">
                  Lexical Evaluation
                </h2>
                {phonemes.length > 0 && (
                  <div className="pb-2 font-pontanoSans text-base font-semibold">
                    <h3 className="inline-block font-archivoNarrow text-lg uppercase italic text-primary">
                      Problematic Phonemes:
                    </h3>{' '}
                    <p className="inline animate-typingFade text-balance text-foreground/80 delay-500">
                      {phonemes}
                    </p>
                  </div>
                )}
                {errorPatterns.length > 0 && (
                  <div className="pb-2 font-pontanoSans text-base font-semibold">
                    <h3 className="inline-block font-archivoNarrow text-lg uppercase italic text-primary">
                      Error Patterns:
                    </h3>{' '}
                    <p className="inline animate-typingFade text-balance text-foreground/80 delay-500">
                      {errorPatterns}
                    </p>
                  </div>
                )}
                {areasForImprovement.length > 0 && (
                  <div className="pb-2 font-pontanoSans text-base font-semibold">
                    <h3 className="inline-block font-archivoNarrow text-lg uppercase italic text-primary">
                      Areas for Improvement:
                    </h3>{' '}
                    <p className="inline animate-typingFade text-balance text-foreground/80 delay-500">
                      {areasForImprovement}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

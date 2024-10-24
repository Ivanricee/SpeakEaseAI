import WordAssessment from './WordAssessment'

interface Props {
  contentObj: any
  idAssesment: string | null
  textContent: string
}

export default function ChatCardContent({ contentObj, idAssesment, textContent }: Props) {
  if (idAssesment) return <WordAssessment idAssessment={idAssesment} />
  if (!idAssesment && !contentObj) {
    return <span className="text-base font-semibold"> {textContent}</span>
  }
  const hasEng = contentObj.languageEnhancementFeedback.length > 0
  const hasTopic = contentObj.topicCorrection.length > 0
  const hasFollowUp = contentObj.contextualFollowUpQuestion.length > 0
  return (
    <div className="text-base font-semibold">
      {hasEng && (
        <div>
          <h3 className="inline-block animate-typingFade font-archivoNarrow text-lg uppercase delay-500">
            Sentence Improvement:
          </h3>{' '}
          <p className="inline animate-typingFade text-balance delay-500">
            {contentObj.languageEnhancementFeedback}
          </p>
        </div>
      )}
      {hasTopic && (
        <div>
          <h3 className="inline-block animate-typingFade font-archivoNarrow text-lg uppercase delay-500">
            Context Notes:
          </h3>{' '}
          <p className="inline animate-typingFade text-balance delay-500">
            {contentObj.topicCorrection}
          </p>
        </div>
      )}
      {hasFollowUp && (
        <div className="mb-2 mt-4">
          <h3 className="animate-typingFade text-center font-archivoNarrow text-xl italic delay-500 md:text-xl">
            {contentObj.contextualFollowUpQuestion}
          </h3>
        </div>
      )}
    </div>
  )
}

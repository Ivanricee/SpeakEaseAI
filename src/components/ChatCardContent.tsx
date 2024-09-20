import WordAssessment from './WordAssessment'

interface Props {
  contentObj: any
  idAssesment: string | null
  textContent: string
}

export default function ChatCardContent({ contentObj, idAssesment, textContent }: Props) {
  console.log({ idAssesment, contentObj, isuserwithrawdata: !idAssesment && !contentObj })
  if (idAssesment) return <WordAssessment idAssessment={idAssesment} />
  if (!idAssesment && !contentObj) {
    return <span className="text-sm"> {textContent}</span>
  }
  const hasEng = contentObj.languageEnhancementFeedback.length > 0
  const hasTopic = contentObj.topicCorrection.length > 0
  const hasFollowUp = contentObj.contextualFollowUpQuestion.length > 0
  return (
    <div className="">
      {hasEng && (
        <>
          <h3 className="animate-typingFade delay-1000">English correction:</h3>
          <p className="animate-typingFade delay-1000">{contentObj.languageEnhancementFeedback}</p>
        </>
      )}
      {hasTopic && (
        <>
          <h3 className="animate-typingFade delay-1000">Context correction:</h3>
          <p className="animate-typingFade delay-1000">{contentObj.topicCorrection}</p>
        </>
      )}
      {hasFollowUp && (
        <>
          <h3 className="animate-typingFade delay-1000">follow-up question:</h3>
          <p className="animate-typingFade delay-1000">{contentObj.contextualFollowUpQuestion}</p>
        </>
      )}
    </div>
  )
}

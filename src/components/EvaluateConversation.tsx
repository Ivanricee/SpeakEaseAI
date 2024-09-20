import useEvaluateConversation from './hooks/useEvaluateConversation'
import { Button } from './ui/button'

export default function EvaluateConversation() {
  const { onEvaluate, responseCount } = useEvaluateConversation()
  return (
    <>
      <h3 className="text-sm text-muted-foreground">{responseCount}/15 responses</h3>
      <Button variant="secondary" onClick={onEvaluate}>
        Evaluate your conversation
      </Button>
    </>
  )
}

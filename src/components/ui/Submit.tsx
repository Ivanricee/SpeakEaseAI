import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './button'

interface Props extends ButtonProps {
  title?: string
  pending?: string
}
export default function Submit({ title = 'Submit', pending = 'Submitting...', ...rest }: Props) {
  const status = useFormStatus()
  console.log('status button', status)

  return (
    <Button {...rest} disabled={status.pending}>
      {status.pending ? pending : title}
    </Button>
  )
}

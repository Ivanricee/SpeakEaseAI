import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AIFormSchema } from '@/app/schema/aiForm-schema'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useFormState } from 'react-dom'
import { KeyState, setKey } from '@/app/actions/openai'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/zustand-store'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { IconCheckbox } from '@tabler/icons-react'
interface CurrentOpenAi {
  key: string
  model: string
}
export default function AIForm() {
  const [status, setStatus] = useState<boolean>(false)
  const currentOpenAi = useRef<CurrentOpenAi>({ key: '', model: '' })
  const { openAiKey, setOpenAiKey } = useAppStore((state) => ({
    openAiKey: state.openAiKey,
    setOpenAiKey: state.setOpenAiKey,
  }))
  const defaultValues = {
    key: '',
    model: '',
  }
  const form = useForm<z.infer<typeof AIFormSchema>>({
    resolver: zodResolver(AIFormSchema),
    defaultValues,
  })
  const [state, formAction] = useFormState<KeyState, FormData>(setKey, {
    isValidKey: null,
  })
  useEffect(() => {
    console.log('entra aqui cuando es false tio?', state)

    if (state?.isValidKey !== null && status) {
      setStatus(false)
    }
    if (state.isValidKey) {
      setOpenAiKey({
        key: currentOpenAi.current.key,
        model: currentOpenAi.current.model,
      })
    } else if (state.isValidKey === false) {
      console.log('entra aqui cuando es false tio?')

      setOpenAiKey(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const onSubmitKey = async (data: z.infer<typeof AIFormSchema>) => {
    setStatus(true)
    currentOpenAi.current = {
      key: data.key,
      model: data.model,
    }
    console.log('data send', data)

    const formdata = new FormData()
    formdata.append('key', data.key)
    formdata.append('model', data.model)
    await formAction(formdata)
    form.reset(defaultValues)
  }
  const hasOpenAiKey = Boolean(openAiKey.key && openAiKey.key?.length > 0)
  const showAlert = Boolean(state.isValidKey || hasOpenAiKey)
  console.log('openAiKey-----------', { state, openAiKey })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Ai</CardTitle>
        <CardDescription>
          The API key will be used for voice recognition (Whisper) and text generation (ChatGPT).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitKey)} className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Api Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      {...field}
                      autoFocus
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an OpenAI model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                      <SelectItem value="gpt-4">gpt-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={status}>
              {status ? 'validating...' : 'Use Key'}
            </Button>
          </form>
        </Form>
        <section>
          {showAlert && (
            <Alert variant="success" className="mt-8">
              <IconCheckbox className="text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription className="text-xs">
                Your OpenAI API key has been validated successfully.
              </AlertDescription>
            </Alert>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

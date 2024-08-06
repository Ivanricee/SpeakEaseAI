'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AIFormSchema } from '@/app/schema/aiForm-schema'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useFormState } from 'react-dom'
import { KeyState, setKey } from '@/app/actions/openai'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/zustand-store'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { IconCheckbox } from '@tabler/icons-react'
interface CurrentOpenAi {
  key: string
}
export default function AIForm() {
  const [status, setStatus] = useState<boolean>(false)
  const currentOpenAi = useRef<CurrentOpenAi>({ key: '' })
  const { openAiKey, setOpenAiKey } = useAppStore((state) => ({
    openAiKey: state.openAiKey,
    setOpenAiKey: state.setOpenAiKey,
  }))
  const defaultValues = {
    key: '',
  }
  const form = useForm<z.infer<typeof AIFormSchema>>({
    resolver: zodResolver(AIFormSchema),
    defaultValues,
  })
  const [state, formAction] = useFormState<KeyState, FormData>(setKey, {
    isValidKey: null,
  })
  useEffect(() => {
    if (state?.isValidKey !== null && status) {
      setStatus(false)
    }
    if (state.isValidKey) {
      setOpenAiKey({
        key: currentOpenAi.current.key,
      })
    } else if (state.isValidKey === false) {
      setOpenAiKey(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const onSubmitKey = async (data: z.infer<typeof AIFormSchema>) => {
    setStatus(true)
    currentOpenAi.current = {
      key: data.key,
    }

    const formdata = new FormData()
    formdata.append('key', data.key)
    await formAction(formdata)
    form.reset(defaultValues)
  }
  const hasOpenAiKey = Boolean(openAiKey.key && openAiKey.key?.length > 0)
  const showAlert = Boolean(state.isValidKey || hasOpenAiKey)

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Add OpenAI API Key</CardTitle>
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
                  <FormMessage />
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
          {state.isValidKey === false && (
            <Alert variant="destructive" className="mt-8">
              <IconCheckbox className="text-red-500" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription className="text-xs">
                Your OpenAI API key is invalid.
              </AlertDescription>
            </Alert>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

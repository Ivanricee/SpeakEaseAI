'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AIFormSchema } from '@/app/schema/aiForm-schema'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useFormState } from 'react-dom'
import { KeyState, setKey } from '@/app/actions/openai'
import { Alert, AlertTitle } from './ui/alert'
import { IconCheckbox, IconInfoCircle, IconInfoCircleFilled, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { Checkbox } from './ui/checkbox'
import useAiFormSetup from './hooks/useAiFormSetup'
import { useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
interface Props {
  hasBorder?: boolean
}
export default function AIForm({ hasBorder = false }: Props) {
  const [state, formAction] = useFormState<KeyState, FormData>(setKey, {
    isOpenAiValidKey: null,
    isAzureValidKey: null,
  })
  const borderStyle = hasBorder
    ? 'border-4 border-primary'
    : 'mr-4 rounded-none border-l-4 border-l-primary/50'
  const { form, setIsValidating, isValidating, validOpenAi, validAzure } = useAiFormSetup(state)
  const isAzureEnabled = form.watch('enableAzure')

  useEffect(() => {
    const azureKey = form.getValues('azureKey')
    const azureRegion = form.getValues('azureRegion')
    if (!isAzureEnabled && azureKey && azureKey?.length > 0) form.setValue('azureKey', '')
    if (!isAzureEnabled && azureRegion && azureRegion?.length > 0) form.setValue('azureRegion', '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAzureEnabled])

  const onSubmitKey = async (data: z.infer<typeof AIFormSchema>) => {
    setIsValidating(true)
    const formdata = new FormData()
    formdata.append('key', data.key)
    formdata.append('enableAzure', data.enableAzure.toString())
    formdata.append('azureKey', data.azureKey || '')
    formdata.append('azureRegion', data.azureRegion || '')

    await formAction(formdata)
  }
  const invalidOpenAi = state.isOpenAiValidKey === false
  const invalidAzure = state.isAzureValidKey === false
  const invalidApiKey = invalidOpenAi || invalidAzure
  const hasApiKey = validOpenAi || validAzure

  return (
    <Card className={`h-full bg-card/60 shadow-none ${borderStyle}`}>
      <CardHeader>
        <CardTitle className="mb-4 px-0.5">Configure your API Keys</CardTitle>
        <CardDescription>
          Use OpenAI for text generation, Whisper for audio, and Azure Speech Services for
          assessment.
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
                  <FormLabel className="font-archivoNarrow">OpenAi Key</FormLabel>
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
            <FormField
              control={form.control}
              name="enableAzure"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-archivoNarrow">Enable Speech Assessment</FormLabel>
                    <FormDescription className="mb-12 text-foreground/70">
                      This feature requires a valid{' '}
                      <Link
                        target="_blank"
                        rel="noreferrer"
                        href={'https://azure.microsoft.com/free/cognitive-services'}
                        className="text-[0.9rem] font-black text-teal-800/80"
                      >
                        Azure subscription.
                      </Link>
                    </FormDescription>
                    {isAzureEnabled && (
                      <div className="flex flex-col gap-4 pt-6">
                        <FormField
                          control={form.control}
                          name="azureKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1 font-archivoNarrow">
                                Speech Resource Key
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="m-0 flex h-auto p-0 text-teal-800/80"
                                    >
                                      <IconInfoCircle className="cursor-pointer" size={20} />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="">
                                    <div>
                                      <h5 className="text-balance text-base font-normal leading-none">
                                        <Link
                                          target="_blank"
                                          rel="noreferrer"
                                          href={
                                            'https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices'
                                          }
                                          className="font-pontanoSans font-bold text-teal-800/80"
                                        >
                                          Create a Speech resource
                                        </Link>
                                      </h5>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="xxxxxxxxxxxxxxxxxxxxxxx"
                                  {...field}
                                  type="password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="azureRegion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-archivoNarrow">Location/Region</FormLabel>
                              <FormControl>
                                <Input placeholder="eastus" {...field} type="text" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                disabled={isValidating || !form.formState.isValid || form.formState.isValidating}
              >
                {isValidating ? 'validating...' : 'Validate'}
              </Button>
            </div>
          </form>
        </Form>
        <section>
          {hasApiKey && (
            <Alert
              variant="success"
              className="mt-4 flex flex-col justify-center bg-green-500/10 text-sm"
            >
              <IconCheckbox />
              {validOpenAi && <AlertTitle>Openai Key Validated</AlertTitle>}
              {validAzure && <AlertTitle>Azure Key Validated</AlertTitle>}
            </Alert>
          )}
          {invalidApiKey && (
            <Alert
              variant="destructive"
              className="mt-4 flex flex-col justify-center bg-red-400/10 text-sm text-red-500/80"
            >
              <IconX className="text-red-600" />
              {invalidOpenAi && <AlertTitle>Openai key could not be validated</AlertTitle>}
              {invalidAzure && <AlertTitle>Azure Key could not be validated</AlertTitle>}
            </Alert>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

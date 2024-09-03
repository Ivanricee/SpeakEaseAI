'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AIFormSchema } from '@/app/schema/aiForm-schema'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/zustand-store'

import { usePathname, useRouter } from 'next/navigation'

export default function useAiFormSetup(state: any) {
  const [isValidating, setIsValidating] = useState<boolean>(false)
  const router = useRouter()
  const path = usePathname()
  const { openAiKey, setOpenAiKey, azureKey, setAzureKey } = useAppStore((appState) => ({
    openAiKey: appState.openAiKey,
    setOpenAiKey: appState.setOpenAiKey,
    azureKey: appState.azureKey,
    setAzureKey: appState.setAzureKey,
  }))
  const defaultValues = {
    key: '',
    azureRegion: '',
    azureKey: '',
    enableAzure: false,
  }
  const form = useForm<z.infer<typeof AIFormSchema>>({
    resolver: zodResolver(AIFormSchema),
    defaultValues,
  })

  useEffect(() => {
    const isSetup = path === '/chat-ai'
    //hanlde form submit result state
    if (state?.isOpenAiValidKey !== null && isValidating) setIsValidating(false)
    // valid open ai key
    if (state.isOpenAiValidKey) {
      setOpenAiKey({
        key: form.getValues('key'),
      })
      // redirect to setup page

      console.log({ setupis: !isSetup })
      !isSetup && !form.getValues('enableAzure') && router.push('/setup')
    } else if (state.isOpenAiValidKey === false) {
      setOpenAiKey({ key: null })
      form.resetField('key')
    }
    // valid azure key
    if (state.isAzureValidKey) {
      setAzureKey({
        key: form.getValues('azureKey') || '',
        isEnable: form.getValues('enableAzure'),
        region: form.getValues('azureRegion') || '',
      })
      //redirect to setup page
      !isSetup && state.isOpenAiValidKey && router.push('/setup')
    } else if (state.isAzureValidKey === false) {
      setAzureKey({ key: null, isEnable: false, region: null })
      form.resetField('azureKey')
      form.resetField('azureRegion')
    }
    //form.reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  //use true and false becouse of null value
  const validOpenAi = openAiKey.key && openAiKey.key?.length > 0
  const validAzure = azureKey.key && azureKey.key?.length > 0

  return { form, setIsValidating, isValidating, validOpenAi, validAzure }
}

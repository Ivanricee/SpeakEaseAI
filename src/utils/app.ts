import { EvaluationResult } from '@/types/assesmentResult'
import { readStreamableValue, StreamableValue } from 'ai/rsc'

type props<T extends any[]> = {
  callback: (...args: T) => void
  delay: number
}
export const debounce = <T extends any[]>({ callback, delay }: props<T>) => {
  let timerId: number | null = null
  return (...args: T) => {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => callback(...args), delay) as unknown as number
  }
}

interface StreamValueToObject {
  partialJSON: EvaluationResult | { [key: string]: string }
  isEval?: boolean
  setStreamObject: (partialJSON: EvaluationResult | { [key: string]: string }) => Promise<void>
  streamValueMsg: StreamableValue<string>
}
export const streamValueToObject = async ({
  partialJSON,
  isEval = false,
  setStreamObject,
  streamValueMsg,
}: StreamValueToObject): Promise<{ [key: string]: string } | null> => {
  let currentCategory = ''
  let currentKey = ''
  let accumulatedContent = ''
  //get keys from object
  const categories = Object.keys(partialJSON)
  let keys: string[] = []
  if (isEval) {
    for (const category of categories) {
      keys = [...keys, ...Object.keys(partialJSON[category])]
    }
  }

  //---------
  const getCurrentKey = () => {
    for (const key of keys) {
      if (accumulatedContent.includes(key)) {
        currentKey = key
        accumulatedContent = ''
        break
      }
    }
  }
  const getCurrentCategory = () => {
    for (const category of categories) {
      if (accumulatedContent.includes(category)) {
        currentCategory = category
        // Reset to remove key from accumulated
        accumulatedContent = ''
        break
      }
    }
  }
  const delayStream = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  for await (const text of readStreamableValue(streamValueMsg)) {
    accumulatedContent += text
    getCurrentCategory()
    if (currentCategory.length > 0 && accumulatedContent.length > 0) {
      if (typeof partialJSON[currentCategory] === 'object') {
        getCurrentKey()
        if (currentKey.length > 0) {
          partialJSON[currentCategory][currentKey] = accumulatedContent.replace(/"\s*,|}|\s*"/g, '')
          const newPartialJSON = structuredClone(partialJSON) as EvaluationResult
          //await delayStream(2000)
          setStreamObject(newPartialJSON)
        }
      } else {
        partialJSON[currentCategory] = accumulatedContent.replace(/"\s*,|}|\s*"/g, '')
        const newPartialJSON = structuredClone(partialJSON) as EvaluationResult
        //await delayStream(2000)
        setStreamObject(newPartialJSON)
      }
    }
  }
  return isEval ? null : partialJSON
}

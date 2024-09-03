import { z } from 'zod'

export const AIFormSchema = z
  .object({
    key: z
      .string({
        required_error: 'Enter your OpenAI API key',
      })
      .min(10, {
        message: 'Api must not be empty',
      })
      .max(200)
      .refine(
        (value) => {
          if (!/\s/.test(value)) return true // just spaces
          if (/^\s+|\s+$/.test(value)) return false //start/end with spaces
          return true
        },
        {
          message: 'The APi key must not be empty, spaces only, or start/end with spaces.',
        }
      ),
    enableAzure: z.boolean().default(false),
    azureKey: z
      .string({
        required_error: 'Enter your Speech Resource Key',
      })
      .refine(
        (value) => {
          if (!/\s/.test(value)) return true // just spaces
          if (/^\s+|\s+$/.test(value)) return false //start/end with spaces
          return true
        },
        {
          message: 'The APi key must not be empty, spaces only, or start/end with spaces.',
        }
      )
      .optional(),
    azureRegion: z
      .string({
        required_error: 'Enter your Speech Resource Key',
      })
      .refine(
        (value) => {
          if (!/\s/.test(value)) return true // just spaces
          if (/^\s+|\s+$/.test(value)) return false //start/end with spaces
          return true
        },
        {
          message: 'The Region/Location must not be empty, spaces only, or start/end with spaces.',
        }
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.enableAzure) return true
      if (!data.azureRegion || data.azureRegion.length < 4) return false
      if (data.azureRegion && data.azureRegion.length >= 4 && data.azureRegion.length <= 30) {
        return true
      }
      return false
    },
    {
      message: 'Length must be between 4 and 30',
      path: ['azureRegion'],
    }
  )
  .refine(
    (data) => {
      if (!data.enableAzure) return true
      if (!data.azureKey || data.azureKey.length < 10) return false
      if (data.azureKey && data.azureKey.length >= 10 && data.azureKey.length <= 50) {
        return true
      }
      return false
    },
    {
      message: 'Length must be between 10 and 50',
      path: ['azureKey'],
    }
  )

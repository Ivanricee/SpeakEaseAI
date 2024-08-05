import { z } from 'zod'

export const AIFormSchema = z.object({
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
})

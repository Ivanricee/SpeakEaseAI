import { z } from 'zod'

export const setupFormSchema = z.object({
  model: z
    .string({
      required_error: 'Select an OpenAI model',
    })
    .min(5, {
      message: 'you must select an OpenAI model',
    }),
  topic: z
    .string({
      required_error: 'topic is required',
    })
    .min(5, {
      message: 'Topic must be at least 5 characters long',
    })
    .max(100, {
      message: 'Topic must be at most 100 characters long',
    })
    .refine(
      (value) => {
        if (!/\s/.test(value)) return true // just spaces
        if (/^\s+|\s+$/.test(value)) return false //start/end with spaces
        return true
      },
      {
        message: 'Topic must not be empty, spaces only, or start/end with spaces.',
      }
    ),
  level: z
    .string({
      required_error: 'Select an english level',
    })
    .min(5),
  role: z
    .optional(
      z
        .string({
          required_error: 'Role is required',
        })
        .max(50, {
          message: 'Role must be at most 50 characters long',
        })
        .refine(
          (value) => {
            if (!/\s/.test(value)) return true // just spaces
            if (/^\s+|\s+$/.test(value)) return false //start/end with spaces
            return true
          },
          {
            message: 'The role must not be empty, spaces only, or start/end with spaces.',
          }
        )
    )
    .default(''),
})

import { z } from 'zod'

export const AIFormSchema = z.object({
  key: z
    .string({
      required_error: 'Enter your OpenAI API key',
    })
    .min(10)
    .max(200),
  model: z
    .string({
      required_error: 'Select an OpenAI model',
    })
    .min(5),
})

export const adjustmentSchema = z.object({
  topic: z.string().min(2).max(150),
  role: z.string().min(5).max(50),
})

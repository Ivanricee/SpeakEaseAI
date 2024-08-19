'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useState } from 'react'
import { useAppStore } from '@/store/zustand-store'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import {
  IconCheckbox,
  IconHelpHexagon,
  IconHelpHexagonFilled,
  IconInfoCircle,
  IconInfoCircleFilled,
  IconInfoSmall,
} from '@tabler/icons-react'
import { setupFormSchema } from '@/app/schema/setup-schema'
import { Textarea } from './ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Separator } from '@radix-ui/react-select'

export default function SetupForm() {
  const [status, setStatus] = useState<boolean>(false)
  const { chatSetup, setChatSetup } = useAppStore((state) => ({
    chatSetup: state.chatSetup,
    setChatSetup: state.setChatSetup,
    setOpenMenu: state.setOpenMenu,
  }))

  const form = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: chatSetup,
  })

  const onSubmitSetup = async (data: z.infer<typeof setupFormSchema>) => {
    setChatSetup(data)
    //setOpenMenu(false)
  }

  return (
    <Card className="max-w-screen-lg">
      <CardHeader>
        <CardTitle className="font-kadwa">Setup</CardTitle>
        <CardDescription>
          Personalize your experience by setting your preferences here!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitSetup)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAi Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    name="model"
                  >
                    <FormControl defaultValue={field.value}>
                      <SelectTrigger defaultValue={field.value}>
                        <SelectValue placeholder="Select an OpenAI model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent defaultValue={field.value}>
                      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                      <SelectItem value="gpt-4">gpt-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                    </SelectContent>
                    <FormMessage className="min-w-fit max-w-min" />
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Technical Front-End Interview with React"
                      className="resize-none"
                      {...field}
                      maxLength={100}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage className="min-w-fit max-w-min" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Role (optional)
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="m-0 flex h-auto p-0">
                          <IconInfoCircleFilled size={22} className="cursor-pointer" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="">
                        <div>
                          <h4 className="text-balance text-sm font-normal leading-none">
                            A role provides better context and focuses the conversation.
                          </h4>
                        </div>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-xs text-muted-foreground">Such as:</p>
                          <ul>
                            <li>
                              <p className="text-xs text-muted-foreground">
                                <strong>Business Consultant.</strong>
                              </p>
                            </li>
                            <li>
                              <p className="text-xs text-muted-foreground">
                                <strong>Pokémon Guide.</strong>
                              </p>
                            </li>
                            <li>
                              <p className="text-xs text-muted-foreground">
                                <strong>Film Specialist.</strong>
                              </p>
                            </li>
                          </ul>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Front-End Developer Interviewer"
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage className="min-w-fit max-w-min" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    name="level"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your english level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                    <FormMessage className="min-w-fit max-w-min" />
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={status}>
              {status ? 'validating...' : 'Save setup'}
            </Button>
          </form>
        </Form>
        {chatSetup.level.length > 0 && (
          <section>
            <Alert variant="success" className="mt-8">
              <IconCheckbox className="text-green-500" />
              <AlertTitle>Setup saved successfully!</AlertTitle>
              <AlertDescription className="text-xs">
                <div>
                  <p>Model: {chatSetup.model}</p>
                  <p>Topic: {chatSetup.topic}</p>
                  <p>Role: {chatSetup.role}</p>
                  <p>Level: {chatSetup.level}</p>
                </div>
              </AlertDescription>
            </Alert>
          </section>
        )}
      </CardContent>
    </Card>
  )
}

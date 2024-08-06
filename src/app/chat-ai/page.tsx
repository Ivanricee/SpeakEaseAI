/* eslint-disable max-len */

'use client'
import Chat from '@/components/Chat'
import { Menu } from '@/components/Menu'
import Microphone from '@/components/Microphone'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useChat } from 'ai/react'

export default function Setup() {
  //const { messages, input, handleInputChange, handleSubmit } = useChat()
  return (
    <main className="min-w-dvw font-robotoSlab container mx-auto h-dvh w-full max-w-screen-xl bg-background">
      <div
        className={
          'flex h-full flex-col-reverse bg-yellow-800/25 md:flex md:h-full md:w-full md:flex-row md:flex-nowrap'
        }
      >
        <section className="h-2/6 bg-red-400/10 md:h-full md:w-4/12">
          <Microphone />
          <Separator />
        </section>
        <section className="h-4/6 bg-green-600/15 md:h-full md:w-8/12">
          <Chat />
          <Menu />
        </section>
      </div>
    </main>
  )
}

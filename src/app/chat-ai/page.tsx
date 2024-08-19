/* eslint-disable max-len */

import Chat from '@/components/Chat'
import { Menu } from '@/components/Menu'
import Microphone from '@/components/Microphone'
import { Separator } from '@/components/ui/separator'

export default function Setup() {
  return (
    <main className="min-w-dvw container mx-auto h-dvh w-full max-w-screen-xl bg-background font-robotoSlab">
      <div
        className={
          'flex h-full flex-col-reverse md:flex md:h-full md:w-full md:flex-row md:flex-nowrap'
        }
      >
        <section className="relative h-2/6 md:h-full md:w-4/12">
          <Menu />
          <Microphone />
          <Separator className="absolute right-0 top-0 hidden md:grid" orientation="vertical" />
          <Separator className="absolute right-0 top-0 grid md:hidden" orientation="horizontal" />
        </section>
        <section className="h-4/6 md:h-full md:w-8/12">
          <Chat />
        </section>
      </div>
    </main>
  )
}

/* eslint-disable max-len */

import Chat from '@/components/Chat'
import { Menu } from '@/components/Menu'
import Microphone from '@/components/Microphone'
import { Separator } from '@/components/ui/separator'

export default function Setup() {
  return (
    <main className="min-w-dvw container mx-auto h-dvh w-full max-w-screen-xl bg-background px-2 font-pontanoSans sm:px-4">
      <div
        className={
          'flex h-full min-h-[40rem] flex-col-reverse lg:flex lg:h-full lg:w-full lg:flex-row lg:flex-nowrap'
        }
      >
        <section className="relative h-1/6 min-h-[10rem] lg:h-full lg:w-4/12">
          <Menu />
          <Microphone />
          <Separator className="absolute right-0 top-0 hidden lg:grid" orientation="vertical" />
          <Separator className="absolute right-0 top-0 grid lg:hidden" orientation="horizontal" />
        </section>
        <section className="h-5/6 lg:h-full lg:w-8/12">
          <Chat />
        </section>
      </div>
    </main>
  )
}

'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AIForm from './AIForm'
import SetupForm from './SetupForm'
import { IconChartInfographic, IconInputAi, IconSettings } from '@tabler/icons-react'
import EvaluateConversation from './EvaluateConversation'
import { useAppStore } from '@/store/zustand-store'

export function Menu() {
  const { openState, tabState, setOpenMenu } = useAppStore((state) => ({
    openState: state.openMenu[0],
    tabState: state.openMenu[1],
    setOpenMenu: state.setOpenMenu,
  }))
  const handleOpenMenu = (open: boolean) => setOpenMenu([open, tabState])
  const handleTab = (tab: string) => setOpenMenu([openState, tab])

  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      <Sheet open={openState} onOpenChange={(open) => handleOpenMenu(open)}>
        <SheetTrigger asChild className="bg-teal-800">
          <section className="absolute -left-4 z-10 flex h-full flex-col justify-center lg:-left-8">
            <Tabs
              className="-translate-y-12"
              value=""
              onValueChange={(e) => handleTab(e)}
              orientation="horizontal"
            >
              <TabsList
                className={'absolute flex h-fit flex-col rounded'}
                aria-orientation="horizontal"
              >
                <TabsTrigger value="progress">
                  <IconChartInfographic />
                </TabsTrigger>
                <TabsTrigger value="setup">
                  <IconSettings />
                </TabsTrigger>
                <TabsTrigger value="openai">
                  <IconInputAi />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </section>
        </SheetTrigger>
        <SheetContent side={'left'}>
          <SheetHeader>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <Tabs className="h-full w-auto" value={tabState} onValueChange={(e) => handleTab(e)}>
            <TabsList className="[&>button]:flex [&>button]:gap-1 [&>button]:uppercase">
              <TabsTrigger value="progress">
                <IconChartInfographic />
                Evaluation
              </TabsTrigger>
              <TabsTrigger value="setup">
                <IconSettings />
                Setup
              </TabsTrigger>
              <TabsTrigger value="openai">
                <IconInputAi />
                OpenAI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="progress" className="h-[calc(100%_-_50px)]">
              <EvaluateConversation />
            </TabsContent>
            <TabsContent value="setup">
              <SetupForm />
            </TabsContent>
            <TabsContent value="openai">
              <AIForm hasBorder />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  )
}

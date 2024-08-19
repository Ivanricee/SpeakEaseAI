'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AIForm from './AIForm'
import SetupForm from './SetupForm'
import { IconChartHistogram, IconInputAi, IconSettings } from '@tabler/icons-react'
import { useState } from 'react'

export function Menu() {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [tab, setTab] = useState<string>('progress')

  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetTrigger asChild>
          <section className="absolute -left-8 z-10 flex h-full flex-col justify-center bg-red-500">
            <Tabs
              className="-translate-y-12"
              value=""
              onValueChange={(e) => setTab(e)}
              orientation="horizontal"
            >
              <TabsList
                className={'absolute flex h-fit flex-col rounded'}
                aria-orientation="horizontal"
              >
                <TabsTrigger value="progress">
                  <IconChartHistogram />
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
            <SheetTitle>Menu Settings</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <Tabs className="w-auto" value={tab} onValueChange={(e) => setTab(e)}>
            <TabsList className="[&>button]:flex [&>button]:gap-1 [&>button]:uppercase">
              <TabsTrigger value="progress">
                <IconChartHistogram />
                Progress
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
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Make changes to your account here. Click save when youre done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <p>Content</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="setup">
              <SetupForm />
            </TabsContent>
            <TabsContent value="openai">
              <AIForm />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  )
}

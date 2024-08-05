'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { useAppStore } from '@/store/zustand-store'

export function Menu() {
  const { openMenu, setOpenMenu } = useAppStore((state) => ({
    openMenu: state.openMenu,
    setOpenMenu: state.setOpenMenu,
  }))
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetTrigger asChild>
          <Button variant="outline">OPen</Button>
        </SheetTrigger>
        <SheetContent side={'right'}>
          <SheetHeader>
            <SheetTitle>Menu Settings</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="openai" className="w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="openai">OpenAI</TabsTrigger>
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

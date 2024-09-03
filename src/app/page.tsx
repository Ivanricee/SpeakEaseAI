import AIForm from '@/components/AIForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Home() {
  //const { messages, input, handleInputChange, handleSubmit } = useChat()
  return (
    <main className="min-w-dvw relative h-dvh w-full flex-col flex-nowrap items-center justify-center bg-background font-robotoSlab">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Card className="container mx-auto flex max-w-screen-lg flex-col items-center justify-center px-0 md:flex-row">
          <CardHeader>
            <h1 className="w-full text-center font-rakkas text-8xl"> Speak Ease AI</h1>
            <p className="font-kadwa text-muted-foreground">
              Learn English through personalized topic conversations with AI. We adapt to your level
              and evaluate your performance with a score.
            </p>
          </CardHeader>
          <CardContent>
            <AIForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

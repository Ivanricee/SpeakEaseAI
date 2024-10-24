/* eslint-disable max-len */
import AIForm from '@/components/AIForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-w-dvw relative h-dvh w-full bg-background font-pontanoSans">
      <div className="flex h-full min-h-[55rem] w-full min-w-[20rem] flex-col items-center justify-center sm:min-h-[40rem] sm:px-5">
        <Card className="container mx-16 flex max-w-screen-lg flex-col items-center justify-center border-4 border-primary bg-[url('/images/main.webp')] bg-cover bg-center bg-no-repeat px-0 bg-blend-multiply md:flex-row">
          <CardHeader className="w-full md:w-7/12">
            <h1 className="w-full text-center font-anton text-8xl text-foreground/85 md:text-[8.8rem]">
              SPEAK EASE AI
            </h1>
            <p className="pt-5 font-pontanoSans font-bold text-foreground/70 md:py-10 md:text-lg">
              Enhance your English skills through personalized conversations on topics you choose.
              Our AI adjusts to your level and gives you a score at the end of each conversation to
              evaluate your performance.
            </p>
          </CardHeader>
          <CardContent className="w-full p-0 sm:w-8/12 md:w-5/12">
            <AIForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

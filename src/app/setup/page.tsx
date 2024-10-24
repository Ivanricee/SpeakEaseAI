import SetupForm from '@/components/SetupForm'

export default function Setup() {
  return (
    <main className="min-w-dvw relative h-dvh w-full flex-col flex-nowrap items-center justify-center bg-background font-pontanoSans">
      <div className="flex h-full min-h-[40rem] w-full min-w-[20rem] flex-col items-center justify-center">
        <SetupForm />
      </div>
    </main>
  )
}

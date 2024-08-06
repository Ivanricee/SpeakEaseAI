import ButtonNavigation from '@/components/ButtonNavigation'
import SetupForm from '@/components/SetupForm'

export default function Setup() {
  return (
    <main className="min-w-dvw relative h-dvh w-full flex-col flex-nowrap items-center justify-center bg-background font-robotoSlab">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <SetupForm />

        <section className="mt-6 flex justify-center">
          <ButtonNavigation page="setup" />
        </section>
      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import { Rakkas, Kadwa, Roboto_Slab } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const kadwa = Kadwa({
  weight: ['400', '700'],
  variable: '--font-kadwa',
  subsets: ['latin'],
  display: 'swap',
})
const rakkas = Rakkas({
  weight: '400',
  variable: '--font-rakkas',
  subsets: ['latin'],
  display: 'swap',
})
const robotoSlab = Roboto_Slab({
  variable: '--font-roboto-slab',
  subsets: ['latin'],
  display: 'swap',
})
const fonts = `${kadwa.variable} ${rakkas.variable} ${robotoSlab.variable}`
export const metadata: Metadata = {
  title: 'Speak Ease AI',
  description: `An app for learning English through custom topic
  conversations with AI. It adjusts to your English level and
  generates a score based on your performance. `,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={fonts} suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

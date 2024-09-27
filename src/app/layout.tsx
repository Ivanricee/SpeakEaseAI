import type { Metadata } from 'next'
import { Anton, Pontano_Sans, Archivo_Narrow } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const anton = Anton({
  weight: '400',
  variable: '--font-anton',
  adjustFontFallback: true,
  fallback: ['System', 'sans-serif'],
  subsets: ['latin'],
  display: 'swap',
})
const archivoNarrow = Archivo_Narrow({
  weight: ['700'],
  style: ['italic', 'normal'],
  adjustFontFallback: true,
  fallback: ['System', 'sans-serif'],
  variable: '--font-archivoNarrow',
  subsets: ['latin'],
  display: 'swap',
})
const pontanoSans = Pontano_Sans({
  weight: ['500', '600'],
  adjustFontFallback: true,
  fallback: ['System', 'sans-serif'],
  variable: '--font-pontanoSans',
  subsets: ['latin'],
  display: 'swap',
})
const fonts = `${archivoNarrow.variable} ${anton.variable} ${pontanoSans.variable}`
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

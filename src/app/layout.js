import { Geist } from 'next/font/google'
import AuthSessionProvider from '@/components/layout/SessionProvider'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'WorkSpace',
  description: 'Plataforma colaborativa de gestión de equipos de trabajo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geist.className}`} suppressHydrationWarning>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
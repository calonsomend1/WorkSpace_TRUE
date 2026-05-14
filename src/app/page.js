import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LandingPage from './LandingPage'

export default async function Home() {
  const session = await getServerSession()

  // Si ya hay sesión activa va directo al dashboard
  if (session?.user) redirect('/dashboard')

  return <LandingPage />
}
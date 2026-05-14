import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession()

  // Si no hay sesión activa redirige al login
  if (!session?.user?.email) redirect('/login')

  // Obtiene los datos del usuario y sus grupos desde la base de datos
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: {
          group: true
        }
      }
    }
  })

  return <DashboardClient user={user} />
}
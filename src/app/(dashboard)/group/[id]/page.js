import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import GroupClient from './GroupClient'

export default async function GroupPage({ params }) {
  const session = await getServerSession()

  if (!session?.user?.email) redirect('/login')

  // En Next.js 16 params es asíncrono
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  const membership = await prisma.member.findFirst({
    where: { userId: user.id, groupId: id }
  })

  if (!membership) redirect('/dashboard')

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: true }
      },
      tasks: {
        include: { user: true }
      },
      messages: {
        include: { user: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  return (
    <GroupClient
      group={group}
      currentUser={user}
      isAdmin={membership.role === 'admin'}
    />
  )
}
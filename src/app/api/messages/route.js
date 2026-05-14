import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// GET — obtiene todos los mensajes de un grupo, o solo los posteriores a 'since'
export async function GET(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const groupId = searchParams.get('groupId')
  const since = searchParams.get('since')

  if (!groupId) {
    return NextResponse.json({ error: 'groupId es obligatorio' }, { status: 400 })
  }

  const where = { groupId }
  if (since) {
    where.createdAt = { gt: new Date(since) }
  }

  const messages = await prisma.message.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(messages)
}

// POST — envía un nuevo mensaje al grupo
export async function POST(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { content, groupId } = await request.json()

    if (!content || !groupId) {
      return NextResponse.json({ error: 'Contenido y grupo son obligatorios' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const message = await prisma.message.create({
      data: {
        content,
        groupId,
        userId: user.id
      },
      include: { user: true }
    })

    return NextResponse.json(message, { status: 201 })

  } catch (error) {
    console.error('Error al enviar mensaje:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// GET — obtiene todos los grupos del usuario autenticado
export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { group: true }
      }
    }
  })

  return NextResponse.json(user.memberships)
}

// POST — crea un nuevo grupo y añade al creador como administrador
export async function POST(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    // Crea el grupo y añade al creador como admin en una sola transacción
    const group = await prisma.group.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: user.id,
            role: 'admin'
          }
        }
      }
    })

    return NextResponse.json(group, { status: 201 })

  } catch (error) {
    console.error('Error al crear grupo:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

}

// DELETE — elimina un grupo si el usuario es administrador
export async function DELETE(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    if (!groupId) {
      return NextResponse.json({ error: 'groupId es obligatorio' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    // Comprueba que el usuario es admin del grupo
    const membership = await prisma.member.findFirst({
      where: { userId: user.id, groupId, role: 'admin' }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Solo el administrador puede eliminar el grupo' }, { status: 403 })
    }

    // Elimina en orden para respetar las relaciones de la base de datos
    await prisma.message.deleteMany({ where: { groupId } })
    await prisma.task.deleteMany({ where: { groupId } })
    await prisma.member.deleteMany({ where: { groupId } })
    await prisma.group.delete({ where: { id: groupId } })

    return NextResponse.json({ message: 'Grupo eliminado correctamente' })

  } catch (error) {
    console.error('Error al eliminar grupo:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
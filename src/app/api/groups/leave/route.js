import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// DELETE — el usuario abandona un grupo
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

    const membership = await prisma.member.findFirst({
      where: { userId: user.id, groupId }
    })

    if (!membership) {
      return NextResponse.json({ error: 'No perteneces a este grupo' }, { status: 404 })
    }

    // El administrador no puede abandonar el grupo, debe eliminarlo
    if (membership.role === 'admin') {
      return NextResponse.json(
        { error: 'El administrador no puede abandonar el grupo. Si quieres salir, elimina el grupo.' },
        { status: 403 }
      )
    }

    await prisma.member.delete({
      where: { id: membership.id }
    })

    return NextResponse.json({ message: 'Has abandonado el grupo correctamente' })

  } catch (error) {
    console.error('Error al abandonar grupo:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// DELETE — el administrador expulsa a un miembro del grupo
export async function DELETE(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const memberId = searchParams.get('memberId')

    if (!groupId || !memberId) {
      return NextResponse.json({ error: 'groupId y memberId son obligatorios' }, { status: 400 })
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    // Comprueba que el que expulsa es admin
    const adminMembership = await prisma.member.findFirst({
      where: { userId: admin.id, groupId, role: 'admin' }
    })

    if (!adminMembership) {
      return NextResponse.json({ error: 'Solo el administrador puede expulsar miembros' }, { status: 403 })
    }

    // No puede expulsarse a sí mismo
    if (memberId === adminMembership.id) {
      return NextResponse.json({ error: 'No puedes expulsarte a ti mismo' }, { status: 400 })
    }

    // Comprueba que el miembro a expulsar pertenece al grupo
    const targetMembership = await prisma.member.findFirst({
      where: { id: memberId, groupId }
    })

    if (!targetMembership) {
      return NextResponse.json({ error: 'El miembro no pertenece a este grupo' }, { status: 404 })
    }

    await prisma.member.delete({
      where: { id: memberId }
    })

    return NextResponse.json({ message: 'Miembro eliminado del grupo' })

  } catch (error) {
    console.error('Error al expulsar miembro:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
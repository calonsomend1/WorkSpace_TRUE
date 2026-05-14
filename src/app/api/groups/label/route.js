import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// PATCH — el administrador asigna o edita la etiqueta de un miembro
export async function PATCH(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { memberId, label, groupId } = await request.json()

    if (!memberId || !groupId) {
      return NextResponse.json({ error: 'memberId y groupId son obligatorios' }, { status: 400 })
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    // Comprueba que el solicitante es admin del grupo
    const adminMembership = await prisma.member.findFirst({
      where: { userId: admin.id, groupId, role: 'admin' }
    })

    if (!adminMembership) {
      return NextResponse.json({ error: 'Solo el administrador puede asignar etiquetas' }, { status: 403 })
    }

    const updated = await prisma.member.update({
      where: { id: memberId },
      data: { label: label || null }
    })

    return NextResponse.json(updated)

  } catch (error) {
    console.error('Error al actualizar etiqueta:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
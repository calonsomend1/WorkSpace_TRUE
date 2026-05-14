import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// POST — invita a un usuario a un grupo por email
export async function POST(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { email, groupId } = await request.json()

    if (!email || !groupId) {
      return NextResponse.json({ error: 'Email y grupo son obligatorios' }, { status: 400 })
    }

    // Comprueba que el que invita es admin del grupo
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    const membership = await prisma.member.findFirst({
      where: { userId: currentUser.id, groupId, role: 'admin' }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Solo los administradores pueden invitar' }, { status: 403 })
    }

    // Busca al usuario a invitar
    const invitedUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!invitedUser) {
      return NextResponse.json({ error: 'No existe ningún usuario con ese email' }, { status: 404 })
    }

    // Comprueba que no sea ya miembro
    const alreadyMember = await prisma.member.findFirst({
      where: { userId: invitedUser.id, groupId }
    })

    if (alreadyMember) {
      return NextResponse.json({ error: 'El usuario ya pertenece al grupo' }, { status: 400 })
    }

    // Añade al usuario como miembro
    await prisma.member.create({
      data: {
        userId: invitedUser.id,
        groupId,
        role: 'member'
      }
    })

    return NextResponse.json({ message: 'Usuario añadido correctamente' }, { status: 201 })

  } catch (error) {
    console.error('Error al invitar usuario:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
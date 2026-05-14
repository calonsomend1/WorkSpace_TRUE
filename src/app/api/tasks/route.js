import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// POST — crea una nueva tarea en el grupo
export async function POST(request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { title, description, assignedTo, groupId } = await request.json()

    if (!title || !groupId) {
      return NextResponse.json({ error: 'Título y grupo son obligatorios' }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo: assignedTo || null,
        groupId,
        status: 'pending'
      },
      include: { user: true }
    })

    return NextResponse.json(task, { status: 201 })

  } catch (error) {
    console.error('Error al crear tarea:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// PATCH — actualiza el estado de una tarea
export async function PATCH(request, { params }) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { status } = await request.json()

    const task = await prisma.task.update({
      where: { id },
      data: { status },
      include: { user: true }
    })

    return NextResponse.json(task)

  } catch (error) {
    console.error('Error al actualizar tarea:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE — elimina una tarea
export async function DELETE(request, { params }) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params

    await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Tarea eliminada' })

  } catch (error) {
    console.error('Error al eliminar tarea:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
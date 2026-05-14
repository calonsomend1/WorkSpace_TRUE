'use client'

import { useState } from 'react'

const COLUMNS = [
  { id: 'pending', label: 'Pendiente' },
  { id: 'in_progress', label: 'En progreso' },
  { id: 'done', label: 'Completado' }
]

export default function KanbanBoard({ tasks, groupId, currentUserId, members }) {
  const [taskList, setTaskList] = useState(tasks)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newAssigned, setNewAssigned] = useState('')
  const [loading, setLoading] = useState(false)

  function getTasksByStatus(status) {
    return taskList.filter(t => t.status === status)
  }

  async function handleCreateTask(e) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        assignedTo: newAssigned || null,
        groupId
      })
    })

    const data = await res.json()

    if (res.ok) {
      setTaskList(prev => [...prev, data])
      setNewTitle('')
      setNewDescription('')
      setNewAssigned('')
      setShowForm(false)
    }

    setLoading(false)
  }

  async function handleMoveTask(taskId, newStatus) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })

    if (res.ok) {
      setTaskList(prev =>
        prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      )
    }
  }

  async function handleDeleteTask(taskId) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      setTaskList(prev => prev.filter(t => t.id !== taskId))
    }
  }

  return (
    <div>
      {/* Botón nueva tarea */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          + Nueva tarea
        </button>
      </div>

      {/* Formulario nueva tarea */}
      {showForm && (
        <form
          onSubmit={handleCreateTask}
          className="rounded-2xl p-6 mb-6 flex flex-col gap-4"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Nueva tarea</h3>

          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Título de la tarea"
            className="rounded-lg px-4 py-3 outline-none text-sm"
            style={{ backgroundColor: 'var(--card-hover)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            required
          />

          <textarea
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            className="rounded-lg px-4 py-3 outline-none text-sm resize-none"
            style={{ backgroundColor: 'var(--card-hover)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            rows={2}
          />

          <select
            value={newAssigned}
            onChange={e => setNewAssigned(e.target.value)}
            className="rounded-lg px-4 py-3 outline-none text-sm"
            style={{ backgroundColor: 'var(--card-hover)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            <option value="">Sin asignar</option>
            {members.map(({ user }) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {loading ? 'Creando...' : 'Crear tarea'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Columnas del tablero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(col => (
          <div
            key={col.id}
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{col.label}</h3>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: 'var(--card-hover)', color: 'var(--muted)' }}
              >
                {getTasksByStatus(col.id).length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {getTasksByStatus(col.id).length === 0 && (
                <p className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>
                  Sin tareas
                </p>
              )}

              {getTasksByStatus(col.id).map(task => (
                <div
                  key={task.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'var(--card-hover)', border: '1px solid var(--border)' }}
                >
                  <p className="font-medium text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                    {task.title}
                  </p>

                  {task.description && (
                    <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                      {task.description}
                    </p>
                  )}

                  {task.user && (
                    <p className="text-xs mb-3" style={{ color: 'var(--accent)' }}>
                      Asignado a: {task.user.name}
                    </p>
                  )}

                  {/* Botones de movimiento */}
                  <div className="flex gap-2 flex-wrap">
                    {COLUMNS.filter(c => c.id !== col.id).map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleMoveTask(task.id, c.id)}
                        className="text-xs px-2 py-1 rounded-lg transition-colors"
                        style={{ backgroundColor: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                      >
                        → {c.label}
                      </button>
                    ))}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-xs px-2 py-1 rounded-lg transition-colors ml-auto hover:opacity-80"
                      style={{ color: 'var(--danger)', backgroundColor: 'var(--card)' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
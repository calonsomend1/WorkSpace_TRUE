'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewGroupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    router.push(`/group/${data.id}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-md rounded-2xl p-8 shadow-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Nuevo grupo</h1>
        <p className="mb-8" style={{ color: 'var(--muted)' }}>Crea un espacio de trabajo para tu equipo</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: 'var(--muted)' }}>Nombre del grupo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              style={{ backgroundColor: 'var(--card-hover)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
              placeholder="Ej: Equipo de diseño"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: 'var(--muted)' }}>Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
              style={{ backgroundColor: 'var(--card-hover)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
              placeholder="¿De qué trata este grupo?"
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="text-white font-semibold rounded-lg py-3 mt-2 transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {loading ? 'Creando...' : 'Crear grupo'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: 'var(--muted)' }}>
          <Link href="/dashboard" style={{ color: 'var(--accent)' }}>
            ← Volver al dashboard
          </Link>
        </p>
      </div>
    </main>
  )
}
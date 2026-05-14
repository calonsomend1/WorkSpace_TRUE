'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import KanbanBoard from './KanbanBoard'
import GroupChat from './GroupChat'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function GroupClient({ group, currentUser, isAdmin }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('board')
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMsg, setInviteMsg] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [editingLabel, setEditingLabel] = useState(null)
  const [labelValue, setLabelValue] = useState('')
  const [members, setMembers] = useState(group.members)

  async function handleInvite(e) {
    e.preventDefault()
    setInviteMsg('')

    const res = await fetch('/api/groups/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, groupId: group.id })
    })

    const data = await res.json()
    setInviteMsg(res.ok ? '✓ Usuario añadido correctamente' : `✗ ${data.error}`)
    if (res.ok) setInviteEmail('')
  }

  async function handleDeleteGroup() {
    setDeleting(true)

    const res = await fetch(`/api/groups?groupId=${group.id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      alert(data.error)
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  async function handleLeaveGroup() {
    setLeaving(true)

    const res = await fetch(`/api/groups/leave?groupId=${group.id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      alert(data.error)
      setLeaving(false)
      setShowLeaveConfirm(false)
    }
  }

  async function handleKickMember(membershipId) {
    const res = await fetch(`/api/groups/kick?groupId=${group.id}&memberId=${membershipId}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error)
    }
  }

  async function handleSaveLabel(membershipId) {
    const res = await fetch('/api/groups/label', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: membershipId, label: labelValue, groupId: group.id })
    })

    if (res.ok) {
      setMembers(prev =>
        prev.map(m => m.id === membershipId ? { ...m, label: labelValue } : m)
      )
      setEditingLabel(null)
      setLabelValue('')
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

      {/* Cabecera del grupo */}
      <div className="border-b px-8 py-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              ← Dashboard
            </Link>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{group.name}</h1>
              {group.description && (
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{group.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Avatares de miembros */}
            <div className="flex items-center gap-1">
              {group.members.slice(0, 3).map(({ user }) => (
                <div
                  key={user.id}
                  title={user.name}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {group.members.length > 3 && (
                <span className="text-xs ml-1" style={{ color: 'var(--muted)' }}>
                  +{group.members.length - 3}
                </span>
              )}
            </div>

            {/* Botones admin */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setShowInvite(!showInvite)}
                  className="text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  + Invitar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm px-3 py-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--danger-soft-bg)', color: 'var(--danger-soft-text)' }}
                >
                  Eliminar grupo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="text-sm px-3 py-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--card-hover)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                  Salir del grupo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Panel de invitación */}
        {showInvite && (
          <div className="max-w-6xl mx-auto mt-3">
            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="Email del usuario a añadir"
                className="rounded-lg px-4 py-2 text-sm outline-none flex-1"
                style={{ backgroundColor: 'var(--card-hover)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                required
              />
              <button
                type="submit"
                className="text-white text-sm px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Añadir
              </button>
            </form>
            {inviteMsg && (
              <p className="text-sm mt-2" style={{ color: inviteMsg.startsWith('✓') ? 'var(--success)' : 'var(--danger)' }}>
                {inviteMsg}
              </p>
            )}
          </div>
        )}

        {/* Pestañas */}
        <div className="max-w-6xl mx-auto mt-4 flex gap-1">
          {['board', 'chat', 'members'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={
                activeTab === tab
                  ? { backgroundColor: 'var(--accent)', color: '#ffffff' }
                  : { color: 'var(--muted)', backgroundColor: 'transparent' }
              }
            >
              {tab === 'board' ? 'Tablero' : tab === 'chat' ? 'Chat' : 'Miembros'}
            </button>
          ))}
        </div>
      </div>

      {/* Modal confirmar eliminar grupo */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>¿Eliminar grupo?</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              Esta acción eliminará el grupo, todas sus tareas y mensajes de forma permanente. No se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteGroup}
                disabled={deleting}
                className="text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex-1 bg-[var(--danger)] hover:bg-[var(--danger-hover)]"
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="font-medium px-4 py-2 rounded-lg transition-colors flex-1"
                style={{ backgroundColor: 'var(--card-hover)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar salir del grupo */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>¿Salir del grupo?</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              Dejarás de tener acceso al espacio compartido, las tareas y el chat de este grupo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLeaveGroup}
                disabled={leaving}
                className="text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex-1 bg-[var(--danger)] hover:bg-[var(--danger-hover)]"
              >
                {leaving ? 'Saliendo...' : 'Sí, salir'}
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="font-medium px-4 py-2 rounded-lg transition-colors flex-1"
                style={{ backgroundColor: 'var(--card-hover)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido según pestaña activa */}
      <div className="max-w-6xl mx-auto px-8 py-6">
        {activeTab === 'board' && (
          <KanbanBoard
            tasks={group.tasks}
            groupId={group.id}
            currentUserId={currentUser.id}
            members={group.members}
          />
        )}
        {activeTab === 'chat' && (
          <GroupChat
            messages={group.messages}
            groupId={group.id}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map(({ id: membershipId, user, role, label }) => (
              <div
                key={user.id}
                className="rounded-2xl p-5 flex items-center justify-between gap-4"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{user.name}</p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>{user.email}</p>

                    {/* Etiqueta del miembro */}
                    {editingLabel === membershipId ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={labelValue}
                          onChange={e => setLabelValue(e.target.value)}
                          placeholder="Ej: Diseñador"
                          className="rounded px-2 py-0.5 text-xs outline-none w-24"
                          style={{ backgroundColor: 'var(--card-hover)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveLabel(membershipId)}
                          className="text-xs hover:opacity-80"
                          style={{ color: 'var(--success)' }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => { setEditingLabel(null); setLabelValue('') }}
                          className="text-xs hover:opacity-80"
                          style={{ color: 'var(--danger)' }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs" style={{ color: 'var(--accent)' }}>
                          {role === 'admin' ? 'Administrador' : label || 'Miembro'}
                        </span>
                        {isAdmin && role !== 'admin' && (
                          <button
                            onClick={() => { setEditingLabel(membershipId); setLabelValue(label || '') }}
                            className="text-xs"
                            style={{ color: 'var(--muted)' }}
                          >
                            ✎
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón expulsar */}
                {isAdmin && role !== 'admin' && (
                  <button
                    onClick={() => handleKickMember(membershipId)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0 hover:opacity-80"
                    style={{ color: 'var(--danger)', backgroundColor: 'var(--card-hover)' }}
                  >
                    Expulsar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
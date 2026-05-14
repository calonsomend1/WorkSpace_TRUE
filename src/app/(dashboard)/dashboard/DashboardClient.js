'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Hand } from 'lucide-react'

export default function DashboardClient({ user }) {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>

      <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            Hola, {user.name} <Hand size={24} className="inline-block ml-1" style={{ color: 'var(--accent)' }} />
          </h1>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ backgroundColor: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--border)' }}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Mis grupos</h2>
          <Link
            href="/dashboard/groups/new"
            className="text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            + Nuevo grupo
          </Link>
        </div>

        {user.memberships.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--card)' }}>
            <p className="text-lg" style={{ color: 'var(--muted)' }}>Todavía no perteneces a ningún grupo.</p>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Crea uno nuevo o pide a alguien que te invite.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.memberships.map(({ group, role }) => (
              <Link
                key={group.id}
                href={`/group/${group.id}`}
                className="rounded-2xl p-6 transition-colors block"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                    {group.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ color: 'var(--muted)', backgroundColor: 'var(--card-hover)' }}>
                    {role === 'admin' ? 'Admin' : 'Miembro'}
                  </span>
                </div>
                {group.description && (
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{group.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { Columns3, MessagesSquare, UsersRound } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
          Work<span style={{ color: 'var(--accent)' }}>Space</span>
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-6" style={{ backgroundColor: 'var(--card)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
          Plataforma colaborativa de equipos
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold mb-6 max-w-3xl leading-tight" style={{ color: 'var(--foreground)' }}>
          Tu equipo. <br />
          <span style={{ color: 'var(--accent)' }}>Un solo espacio.</span>
        </h1>

        <p className="text-lg max-w-xl mb-10" style={{ color: 'var(--muted)' }}>
          WorkSpace reúne en un mismo lugar la gestión de tareas, la comunicación y la organización de tu equipo de trabajo.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Empezar gratis
          </Link>
          <Link
            href="/login"
            className="font-semibold px-8 py-3 rounded-xl transition-colors text-sm border"
            style={{ color: 'var(--foreground)', borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
          >
            Iniciar sesión
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="px-8 py-16 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Columns3,
              title: 'Tablero Kanban',
              description: 'Organiza las tareas de tu equipo en columnas. Crea, asigna y mueve tarjetas fácilmente.'
            },
            {
              icon: MessagesSquare,
              title: 'Chat de equipo',
              description: 'Comunícate con los miembros de tu grupo en tiempo real sin salir de la plataforma.'
            },
            {
              icon: UsersRound,
              title: 'Gestión de grupos',
              description: 'Crea grupos de trabajo, invita miembros y gestiona roles de administrador y miembro.'
            }
          ].map(feature => (
            <div
              key={feature.title}
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="mb-4" style={{ color: 'var(--accent)' }}>
                <feature.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
        WorkSpace — Proyecto TFG DAW
      </footer>
    </div>
  )
}
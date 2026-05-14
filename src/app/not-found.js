'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <p className="text-8xl font-bold mb-4" style={{ color: 'var(--accent)' }}>404</p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
        Página no encontrada
      </h1>

      <p className="text-sm mb-8 text-center max-w-sm" style={{ color: 'var(--muted)' }}>
        La página que estás buscando no existe o ha sido movida.
      </p>

      <Link
        href="/"
        className="text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        Volver al inicio
      </Link>
    </div>
  )
}
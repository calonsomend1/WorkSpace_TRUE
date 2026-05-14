import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      // Solo permite el acceso si existe un token de sesión válido
      authorized: ({ token }) => !!token
    }
  }
)

// Rutas que requieren autenticación
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/group/:path*',
  ]
}
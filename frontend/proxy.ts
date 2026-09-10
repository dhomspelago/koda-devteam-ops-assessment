import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req)
  const { pathname } = req.nextUrl
  const isAuthPage = pathname.startsWith('/auth')
  const isAuthenticated = !!sessionCookie

  if (pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/auth/:path*'],
}

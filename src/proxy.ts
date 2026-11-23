import { NextResponse, type NextRequest } from 'next/server'
import { englishToInternal } from '@/lib/i18n'

/**
 * Public URLs → internal app/[lang] routes.
 *   /agence            → rewrite /fr/agence
 *   /en/agency         → rewrite /en/agence
 *   /fr/...            → 308 to the unprefixed French URL (single canonical)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/fr' || pathname.startsWith('/fr/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const bare = pathname.slice(3) || '/'
    const internal = englishToInternal(bare)
    const url = request.nextUrl.clone()
    url.pathname = `/en${internal === '/' ? '' : internal}`
    return internal === bare ? NextResponse.next() : NextResponse.rewrite(url)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/fr${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    // Everything except Next internals, API routes and files with an extension.
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}

'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Page transition: 500ms cross-fade on client navigations only.
 * The first (server-rendered) load is never faded, so LCP is not delayed.
 */
let hydrated = false

export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => hydrated)
  useEffect(() => {
    hydrated = true
  }, [])
  return <div className={animate ? 'page-enter' : undefined}>{children}</div>
}

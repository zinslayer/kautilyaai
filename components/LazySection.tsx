'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function LazySection({
  children,
  rootMargin = '240px 0px',
  fallbackHeight = '28rem',
}: {
  children: ReactNode
  rootMargin?: string
  fallbackHeight?: string
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!wrapperRef.current || isMounted) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMounted(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin, threshold: 0.01 },
    )

    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [isMounted, rootMargin])

  return (
    <div ref={wrapperRef} className="min-h-0">
      {isMounted ? children : <div style={{ minHeight: fallbackHeight }} aria-hidden="true" />}
    </div>
  )
}

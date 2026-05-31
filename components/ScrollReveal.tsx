'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const DEFAULT_ROOTS = '.home-page, .app-shell, .app-shell-root, .auth-page'

export function ScrollReveal({ rootSelector = DEFAULT_ROOTS }: { rootSelector?: string }) {
    const pathname = usePathname()

    useEffect(() => {
        const roots = rootSelector.split(',').map((s) => s.trim())
        const selector = roots.map((r) => `${r} .reveal-on-scroll`).join(', ')

        // Helper to observe a list of elements
        const observeElements = (observer: IntersectionObserver, list: Element[] | NodeListOf<HTMLElement>) => {
            Array.from(list).forEach((el) => {
                const node = el as HTMLElement
                if (node.classList.contains('reveal-visible')) return
                observer.observe(node)
            })
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    const el = entry.target as HTMLElement
                    const index = Number(el.dataset.revealIndex ?? 0)
                    el.style.transitionDelay = `${index * 100}ms`
                    el.classList.add('reveal-visible')
                    observer.unobserve(el)
                })
            },
            { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
        )

        // Initial observe pass
        const initial = document.querySelectorAll<HTMLElement>(selector)
        observeElements(observer, initial)

        // MutationObserver fallback: watches for new nodes added dynamically (client nav, portal inserts)
        const mutationObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (!m.addedNodes || m.addedNodes.length === 0) continue
                m.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return
                    // If an added node itself matches, observe it
                    if (node.matches && (node as Element).matches(selector)) {
                        observeElements(observer, [node])
                    }
                    // Also search within the subtree
                    const nested = (node as Element).querySelectorAll ? (node as Element).querySelectorAll(selector) : null
                    if (nested && nested.length) observeElements(observer, nested)
                })
            }
        })

        mutationObserver.observe(document.body, { childList: true, subtree: true })

        return () => {
            observer.disconnect()
            mutationObserver.disconnect()
        }
        // Re-run when pathname changes so newly-rendered routes get observed
    }, [rootSelector, pathname])

    return null
}

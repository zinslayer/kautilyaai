'use client'

import { useCallback, useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BrandLogo } from './BrandLogo'

const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Sectors', href: '#sectors' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Case Studies', href: '#case-studies' },
]

export function MarketingHeader() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    const closeDrawer = useCallback(() => setDrawerOpen(false), [])

    useEffect(() => {
        if (!drawerOpen) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [drawerOpen])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDrawer()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [closeDrawer])

    return (
        <>
            <header className="landing-marketing-header sticky top-0 z-50 border-b border-slate-200">
                <div className="landing-header-inner app-container flex items-center justify-between gap-3 py-4">
                    <BrandLogo />
                    <nav className="landing-desktop-nav hidden items-center gap-8 md:flex" aria-label="Main">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <div className="landing-header-actions flex shrink-0 items-center gap-2">
                        <a
                            href="#early-access"
                            data-modal-trigger="early-access"
                            className="landing-nav-cta btn-primary shrink-0"
                        >
                            <span className="landing-nav-cta-full">Request Early Access</span>
                            <span className="landing-nav-cta-short">Get Access</span>
                        </a>
                        <button
                            type="button"
                            className="landing-menu-toggle md:hidden"
                            aria-expanded={drawerOpen}
                            aria-controls="landing-mobile-drawer"
                            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
                            onClick={() => setDrawerOpen((open) => !open)}
                        >
                            {drawerOpen ? <X className="h-6 w-6" strokeWidth={2} /> : <Menu className="h-6 w-6" strokeWidth={2} />}
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`landing-drawer-backdrop md:hidden ${drawerOpen ? 'landing-drawer-backdrop--open' : ''}`}
                aria-hidden={!drawerOpen}
                onClick={closeDrawer}
            />

            <nav
                id="landing-mobile-drawer"
                className={`landing-mobile-drawer md:hidden ${drawerOpen ? 'landing-mobile-drawer--open' : ''}`}
                aria-label="Mobile"
                aria-hidden={!drawerOpen}
            >
                <button
                    type="button"
                    className="landing-drawer-close"
                    aria-label="Close menu"
                    onClick={closeDrawer}
                >
                    <X className="h-6 w-6" strokeWidth={2} />
                </button>
                <div className="landing-drawer-links">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="landing-drawer-link"
                            onClick={closeDrawer}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                <a
                    href="#early-access"
                    data-modal-trigger="early-access"
                    className="landing-drawer-cta btn-primary"
                    onClick={closeDrawer}
                >
                    Request Early Access
                </a>
            </nav>
        </>
    )
}

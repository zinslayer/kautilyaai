'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'Command Center', href: '/dashboard', lockedPreview: true },
    { name: 'Data Cleaning', href: '/dashboard/processing', lockedPreview: true },
    { name: 'Analytics', href: '/dashboard/analytics', lockedPreview: true },
    { name: 'Satellite Intel', href: '/dashboard/satellite', lockedPreview: true },
    { name: 'Competitors', href: '/dashboard/competitors', lockedPreview: true },
    { name: 'Tariff Optimizer', href: '/dashboard/tariff-optimizer', lockedPreview: true },
    { name: 'Sector Intel', href: '/dashboard/sector-intelligence', lockedPreview: true },
    { name: 'Market Entry', href: '/dashboard/market-entry', lockedPreview: true },
]

export default function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="dashboard-nav border-b" aria-label="Dashboard modules">
            <div className="dashboard-nav-scroll app-container overflow-x-auto py-2 md:py-3">
                <div className="flex min-w-max items-center gap-2 px-0.5">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                data-delayed-enterprise-modal={item.lockedPreview ? 'true' : undefined}
                                data-feature={item.lockedPreview ? item.name : undefined}
                                className={cn(
                                    'dashboard-nav-link rounded-lg px-3 py-2 text-sm font-medium transition',
                                    isActive
                                        ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                )}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { AppHeader } from '@/components/layout/Headers'
import DashboardNav from '@/components/layout/DashboardNav'
import { cn } from '@/lib/utils'

type ColorTone = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose'

function normalizeTone(tone: ColorTone): 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo' {
    const map: Record<ColorTone, 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'> = {
        blue: 'blue',
        cyan: 'blue',
        green: 'green',
        emerald: 'green',
        purple: 'purple',
        indigo: 'indigo',
        orange: 'orange',
        amber: 'orange',
        pink: 'pink',
        rose: 'pink',
    }
    return map[tone]
}

export function AppShell({
    title,
    titleHighlight,
    subtitle,
    badge,
    children,
    actions,
    showNav = true,
}: {
    title: string
    titleHighlight?: string
    subtitle: string
    badge?: string
    children: ReactNode
    actions?: ReactNode
    showNav?: boolean
}) {
    return (
        <div className="app-shell min-h-screen overflow-x-hidden">
            <AppHeader actions={actions} />
            {showNav && <DashboardNav />}
            <main className="app-main app-container py-6 md:py-8">
                <div className="app-page-header mb-8">
                    {badge && (
                        <div className="badge-pill reveal-on-scroll mb-4">
                            <span className="text-blue-500">✦</span>
                            {badge}
                        </div>
                    )}
                    <h1 className="page-title reveal-on-scroll" data-reveal-index="1">
                        {title}
                        {titleHighlight && <span className="app-title-highlight"> {titleHighlight}</span>}
                    </h1>
                    <p className="page-subtitle reveal-on-scroll max-w-3xl" data-reveal-index="2">
                        {subtitle}
                    </p>
                </div>
                {children}
            </main>
        </div>
    )
}

/** @deprecated Use AppShell — kept for existing imports */
export const PremiumShell = AppShell

export function Panel({
    title,
    eyebrow,
    children,
    action,
    className = '',
}: {
    title?: string
    eyebrow?: string
    children: ReactNode
    action?: ReactNode
    className?: string
}) {
    return (
        <section className={cn('surface-card app-panel reveal-on-scroll', className)}>
            {(title || eyebrow || action) && (
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>}
                        {title && <h2 className="text-lg font-bold text-slate-900">{title}</h2>}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </section>
    )
}

export function MetricCard({
    label,
    value,
    detail,
    icon,
    tone = 'blue',
    revealIndex,
}: {
    label: string
    value: string
    detail?: string
    icon: ReactNode
    tone?: ColorTone
    revealIndex?: number
}) {
    const tones = {
        blue: 'icon-box-blue',
        green: 'icon-box-green',
        purple: 'icon-box-purple',
        orange: 'icon-box-orange',
        pink: 'icon-box-pink',
        indigo: 'icon-box-indigo',
    }
    const resolved = normalizeTone(tone)

    return (
        <div
            className="surface-card app-metric-card group reveal-on-scroll"
            data-reveal-index={revealIndex}
        >
            <div className={cn('mb-4 app-icon-box', tones[resolved])}>{icon}</div>
            <p className="text-sm text-[#4a5568]">{label}</p>
            <p className="app-metric-value mt-1 text-3xl font-bold">{value}</p>
            {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
        </div>
    )
}

export function SegmentedControl({
    items,
    active,
    onChange,
}: {
    items: string[]
    active: string
    onChange: (item: string) => void
}) {
    return (
        <div className="app-segmented-control flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {items.map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => onChange(item)}
                    className={cn(
                        'app-segment-btn whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition',
                        active === item ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                    )}
                >
                    {item}
                </button>
            ))}
        </div>
    )
}

export function ProgressBar({
    value,
    tone = 'blue',
}: {
    value: number
    tone?: ColorTone
}) {
    const colors = {
        blue: 'bg-blue-600',
        green: 'bg-green-500',
        orange: 'bg-orange-500',
        pink: 'bg-rose-500',
        indigo: 'bg-indigo-500',
        purple: 'bg-purple-500',
    }
    const resolved = normalizeTone(tone)
    return (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className={cn('h-full rounded-full', colors[resolved])} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
        </div>
    )
}

export function Sparkline({ values, positive = true }: { values: number[]; positive?: boolean }) {
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = Math.max(1, max - min)
    const points = values.map((value, index) => `${index * 14 + 2},${26 - ((value - min) / range) * 20}`).join(' ')
    return (
        <svg className="h-8 w-20" viewBox="0 0 72 30" aria-hidden="true">
            <polyline
                fill="none"
                stroke={positive ? '#16a34a' : '#e11d48'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    )
}

export function StatusBadge({
    children,
    tone = 'blue',
}: {
    children: ReactNode
    tone?: ColorTone | 'slate'
}) {
    const tones = {
        blue: 'border-blue-200 bg-blue-50 text-blue-700',
        cyan: 'border-blue-200 bg-blue-50 text-blue-700',
        green: 'border-green-200 bg-green-50 text-green-700',
        emerald: 'border-green-200 bg-green-50 text-green-700',
        amber: 'border-amber-200 bg-amber-50 text-amber-700',
        orange: 'border-amber-200 bg-amber-50 text-amber-700',
        rose: 'border-rose-200 bg-rose-50 text-rose-700',
        pink: 'border-rose-200 bg-rose-50 text-rose-700',
        purple: 'border-purple-200 bg-purple-50 text-purple-700',
        indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
        slate: 'border-slate-200 bg-slate-50 text-slate-600',
    }
    return (
        <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', tones[tone])}>
            {children}
        </span>
    )
}

export function ActionLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="btn-secondary px-3 py-2 text-xs">
            {children}
            <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
    )
}

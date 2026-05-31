import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandLogo({ className, showTagline = false }: { className?: string; showTagline?: boolean }) {
    return (
        <Link href="/" className={cn('group flex items-center gap-2.5', className)}>
            <div className="rounded-lg bg-blue-600 p-2 shadow-sm transition group-hover:bg-blue-700">
                <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
                <span className="text-xl font-bold text-blue-700">KautilyaAI</span>
                {showTagline && (
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        Trade Intelligence
                    </span>
                )}
            </div>
        </Link>
    )
}

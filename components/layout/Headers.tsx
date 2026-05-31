import type { ReactNode } from 'react'
import { BrandLogo } from './BrandLogo'

export { MarketingHeader } from './MarketingHeader'

export function AppHeader({ actions }: { actions?: ReactNode }) {
    return (
        <header className="app-header sticky top-0 z-50 border-b border-slate-200">
            <div className="app-header-inner app-container flex items-center justify-between gap-3 py-3 md:gap-4 md:py-4">
                <BrandLogo />
                {actions ? (
                    <div className="app-header-actions flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 md:gap-3">
                        {actions}
                    </div>
                ) : null}
            </div>
        </header>
    )
}

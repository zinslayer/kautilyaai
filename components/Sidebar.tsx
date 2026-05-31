"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    Home, 
    Satellite, 
    Building2, 
    Scale, 
    LayoutDashboard, 
    FileText, 
    History, 
    Settings, 
    ShieldAlert, 
    Sparkles 
} from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Command Center', icon: Home, href: '/dashboard' },
        { name: 'Satellite Intel', icon: Satellite, href: '/dashboard/satellite', badge: 'SPACE' },
        { name: 'Company Intel', icon: Building2, href: '/dashboard/competitors' },
        { name: 'Tariff Optimizer', icon: Scale, href: '/dashboard/tariff-optimizer' },
        { name: 'Sector Intel', icon: LayoutDashboard, href: '/dashboard/sector-intelligence' },
        { name: 'AI Reports', icon: FileText, href: '/dashboard/market-entry' },
    ]

    return (
        <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col h-screen border-r border-slate-800 sticky top-0 shrink-0 select-none z-40">
            {/* Logo area */}
            <div className="p-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md">
                <Link href="/dashboard" className="flex flex-col gap-1 group">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent group-hover:scale-[1.02] transition-transform duration-300">
                            KautilyaAI
                        </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-500">
                        Trade Intelligence
                    </span>
                </Link>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                <span className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest block mb-3">
                    Intelligence Hub
                </span>
                
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    const Icon = item.icon
                    
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group ${
                                isActive 
                                    ? 'bg-slate-900 text-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border-l-2 border-cyan-400' 
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
                                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                                }`} />
                                <span>{item.name}</span>
                            </div>
                            {item.badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}

                {/* Alternative Data (Locked) */}
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-950/20 border border-transparent select-none cursor-not-allowed group">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-4 w-4 text-slate-700" />
                        <span>Alternative Data</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider bg-slate-800 text-slate-500 border border-slate-700">
                        PRO
                    </span>
                </div>
            </nav>

            {/* Pro Upgrade Card */}
            <div className="p-4 m-4 bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.15)] relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
                <div className="relative">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-2">
                        <Sparkles className="h-3 w-3 animate-spin" />
                        <span>PRO ACCESS</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                        Unlock real-time shipping manifests, vessel trajectories, and factory roof thermal APIs.
                    </p>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-all duration-300 shadow-[0_0_12px_rgba(99,102,241,0.4)] active:scale-[0.98]">
                        Upgrade to Pro
                    </button>
                </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-800 flex flex-col gap-1">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900/20 transition-colors"
                >
                    <History className="h-3.5 w-3.5" />
                    <span>History</span>
                </Link>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900/20 transition-colors"
                >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Preferences</span>
                </Link>
            </div>
        </aside>
    )
}

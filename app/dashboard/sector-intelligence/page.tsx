"use client"

import { useState } from 'react'
import { Activity, Battery, Factory, FlaskConical, Gem, Leaf, Shirt, TrendingDown, TrendingUp } from 'lucide-react'
import { MetricCard, Panel, PremiumShell, ProgressBar, SegmentedControl, StatusBadge } from '@/components/premium/Studio'

const sectors = {
    'Chemicals & Pharma': {
        icon: FlaskConical,
        metrics: [['CAS tracked', '8,240', '+3% YoY'], ['CPCB notices', '14', '2 new'], ['FDA/DMF events', '214', '+12%'], ['REACH watchlist', '62', 'EU active']],
        feed: ['CPCB red-category audit triggered for Ankleshwar GIDC plants.', 'Aromatic intermediates REACH renewal window opens in 45 days.', 'US FDA DMF filing accepted for anti-inflammatory API intermediate.'],
        trackers: ['Toluene technical grade', 'Acetic acid glacial', 'Methanol India port', 'Liquid chlorine'],
    },
    'Agri-commodities': {
        icon: Leaf,
        metrics: [['NDVI stress zones', '18', 'Maharashtra'], ['IMD rainfall', '-12%', 'Season deficit'], ['MSP tracker', 'INR 2,275/qtl', 'Wheat'], ['Quota limits', '3 active', 'Rice/onion']],
        feed: ['Soybean belt NDVI drops below healthy range.', 'Basmati MEP revised upward to protect domestic supply.', 'Grape phytosanitary clearances reopen EU opportunity.'],
        trackers: ['Basmati rice', 'Soybean meal', 'Sugar S-30', 'Cotton Shankar-6'],
    },
    'Textiles & Apparel': {
        icon: Shirt,
        metrics: [['Bangladesh cost gap', '+24%', 'India higher'], ['Vietnam benchmark', '+11%', 'India higher'], ['PLI status', 'INR 3,400 Cr', 'Disbursed'], ['Buyer shifts', '15%', 'From 8%']],
        feed: ['Fast-fashion brands increase India sourcing quotas.', 'Cotton yarn spike squeezes Tirupur exporters.', 'EU traceability regulation creates registration backlog.'],
        trackers: ['Cotton yarn 30s', 'Polyester staple fiber', 'MMF yarn', 'Denim fabric 11 oz'],
    },
    'Electronics & EV': {
        icon: Battery,
        metrics: [['Component dependency', '68%', 'China exposed'], ['Lithium matrix', '96%', 'Import reliance'], ['PLI orders', '$2.4B', '+34%'], ['China+1 list', '42 firms', 'High fit']],
        feed: ['Battery management unit BIS extension affects Q2 imports.', 'Lithium carbonate prices soften month over month.', 'Noida display capacity expansion shifts Vietnam benchmark.'],
        trackers: ['Lithium carbonate', 'Cobalt sulphate', 'Silicon wafers', 'Battery-grade copper foil'],
    },
    'Metals & Mining': {
        icon: Gem,
        metrics: [['MMDR trackers', '9', 'Rule changes'], ['LME copper', '$9,840/MT', '+12%'], ['Safeguard probes', '3', 'DGTR active'], ['Duty deltas', '7 lines', 'At risk']],
        feed: ['Anti-dumping proposal opens on CR stainless coils.', 'Captive mine royalty changes pressure integrated steelmakers.', 'Copper smelter expansion lowers import dependence outlook.'],
        trackers: ['LME copper', 'HRC steel', 'Aluminium LME', 'Iron ore 62% Fe'],
    },
}

export default function SectorIntelligencePage() {
    const names = Object.keys(sectors) as Array<keyof typeof sectors>
    const [active, setActive] = useState<keyof typeof sectors>('Chemicals & Pharma')
    const data = sectors[active]
    const Icon = data.icon

    return (
        <PremiumShell title="Sector Intelligence" subtitle="A multi-sector intelligence portal for compliance, commodity, supply-chain, policy, and China+1 strategy signals.">
            <div className="space-y-8">
                <SegmentedControl items={names} active={active} onChange={(item) => setActive(item as keyof typeof sectors)} />

                <Panel>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-600"><Icon className="h-7 w-7" /></div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-50">{active}</h2>
                                <p className="mt-1 text-sm text-slate-400">Live simulated signal matrix tuned to sector-specific regulatory and commercial workflows.</p>
                            </div>
                        </div>
                        <StatusBadge tone="emerald">Live feed active</StatusBadge>
                    </div>
                </Panel>

                <div className="grid gap-4 md:grid-cols-4">
                    {data.metrics.map(([label, value, detail], index) => (
                        <MetricCard key={label} label={label} value={value} detail={detail} icon={index % 2 ? <TrendingUp className="h-5 w-5" /> : <Activity className="h-5 w-5" />} tone={index === 1 ? 'amber' : index === 2 ? 'emerald' : 'cyan'} />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-12">
                    <Panel title="Critical Intelligence Feed" eyebrow="Signals" className="xl:col-span-7">
                        <div className="space-y-3">
                            {data.feed.map((item, index) => (
                                <div key={item} className="rounded-xl rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="mb-3 flex items-center justify-between">
                                        <StatusBadge tone={index === 0 ? 'rose' : index === 1 ? 'amber' : 'cyan'}>{index === 0 ? 'Critical' : index === 1 ? 'Watch' : 'Info'}</StatusBadge>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{index + 2} hrs ago</span>
                                    </div>
                                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    <div className="space-y-6 xl:col-span-5">
                        <Panel title="Price and Policy Matrix" eyebrow="Trackers">
                            <div className="space-y-3">
                                {data.trackers.map((tracker, index) => (
                                    <div key={tracker} className="rounded-lg rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-800">{tracker}</span>
                                            <span className={`flex items-center gap-1 text-xs font-bold ${index % 2 ? 'text-rose-300' : 'text-emerald-300'}`}>
                                                {index % 2 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                                                {index % 2 ? '+6%' : '-4%'}
                                            </span>
                                        </div>
                                        <ProgressBar value={72 - index * 10} tone={index % 2 ? 'amber' : 'emerald'} />
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="AI Sector Brief" eyebrow="Consulting note">
                            <div className="space-y-4 text-sm leading-6 text-slate-600">
                                <p><Factory className="mr-2 inline h-4 w-4 text-blue-600" />Prioritize entities where policy pressure and buyer diversification overlap in the same quarter.</p>
                                <p>The fastest demo value is showing a user how one sector lens changes recommended actions, not only headline metrics.</p>
                            </div>
                        </Panel>
                    </div>
                </div>
            </div>
        </PremiumShell>
    )
}

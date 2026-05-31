"use client"

import { Activity, AlertTriangle, BarChart3, Brain, Building2, Factory, Globe2, Network, ShieldCheck, TrendingUp } from 'lucide-react'
import { MetricCard, Panel, PremiumShell, ProgressBar, Sparkline, StatusBadge } from '@/components/premium/Studio'

const financials = [
    { metric: 'Revenue', fy22: '6,190 Cr', fy23: '7,080 Cr', fy24: '6,765 Cr', trend: [54, 68, 72, 64] },
    { metric: 'EBITDA', fy22: '1,041 Cr', fy23: '1,184 Cr', fy24: '1,020 Cr', trend: [42, 55, 58, 49] },
    { metric: 'Gross debt', fy22: '2,880 Cr', fy23: '3,260 Cr', fy24: '3,510 Cr', trend: [38, 44, 52, 57] },
    { metric: 'Capex', fy22: '920 Cr', fy23: '1,140 Cr', fy24: '1,380 Cr', trend: [24, 34, 48, 60] },
]

const destinations = [
    { market: 'Germany', value: 26 }, { market: 'US', value: 22 }, { market: 'Japan', value: 16 },
    { market: 'Brazil', value: 12 }, { market: 'UAE', value: 10 }, { market: 'Korea', value: 8 },
]

const productMix = [
    { label: 'Agrochemical intermediates', value: 34, tone: 'cyan' as const },
    { label: 'Pharma intermediates', value: 26, tone: 'emerald' as const },
    { label: 'Dyes and pigments', value: 18, tone: 'indigo' as const },
    { label: 'Custom synthesis', value: 14, tone: 'amber' as const },
    { label: 'Others', value: 8, tone: 'rose' as const },
]

const buyers = [
    { name: 'BASF', tier: 'Tier 1', x: '14%', y: '28%' },
    { name: 'Bayer', tier: 'Tier 1', x: '70%', y: '22%' },
    { name: 'Lanxess', tier: 'Tier 2', x: '55%', y: '70%' },
    { name: 'Divis Labs', tier: 'Tier 2', x: '24%', y: '68%' },
]

export default function CompanyProfilePage() {
    return (
        <PremiumShell
            title="Aarti Industries Ltd."
            subtitle="Company profile deep-dive with simulated finance, export, customer, supply-chain, regulatory, and AI strategic intelligence layers."
        >
            <div className="space-y-8">
                <Panel className="overflow-hidden">
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                        <div>
                            <div className="mb-4 flex flex-wrap gap-2">
                                <StatusBadge tone="rose">Active threat</StatusBadge>
                                <StatusBadge tone="amber">Expanding capacity</StatusBadge>
                                <StatusBadge tone="emerald">FDA approved</StatusBadge>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-50">Specialty chemicals challenger profile</h2>
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                                Mumbai-headquartered manufacturer with concentration across nitrochlorobenzenes, pharma intermediates, agrochemical building blocks, and custom synthesis. Current risk posture is driven by capacity expansion, EU buyer traction, and aggressive export repricing.
                            </p>
                        </div>
                        <div className="grid gap-3 text-sm">
                            {[
                                ['Sector', 'Specialty chemicals'],
                                ['Location', 'Mumbai, Maharashtra'],
                                ['Ticker', 'NSE: AARTIIND | BSE: 524208'],
                                ['Primary markets', 'EU, US, Japan, Brazil'],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between rounded-lg rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span className="text-slate-500">{label}</span>
                                    <span className="font-bold text-slate-800">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Panel>

                <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard label="Threat score" value="88 / 100" detail="Up 12 points in 30 days" icon={<AlertTriangle className="h-5 w-5" />} tone="rose" />
                    <MetricCard label="Export velocity" value="+22%" detail="Germany and Japan lanes" icon={<TrendingUp className="h-5 w-5" />} tone="emerald" />
                    <MetricCard label="Customer overlap" value="9 accounts" detail="3 high-value conflicts" icon={<Network className="h-5 w-5" />} tone="indigo" />
                    <MetricCard label="Compliance posture" value="Medium" detail="CPCB watchlist signal" icon={<ShieldCheck className="h-5 w-5" />} tone="amber" />
                </div>

                <div className="grid gap-6 xl:grid-cols-12">
                    <Panel title="Financial Layer" eyebrow="FY22-FY24" className="xl:col-span-7">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[620px] text-left text-sm">
                                <thead className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3">Metric</th><th className="pb-3">FY22</th><th className="pb-3">FY23</th><th className="pb-3">FY24</th><th className="pb-3">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {financials.map((row) => (
                                        <tr key={row.metric}>
                                            <td className="py-4 font-bold text-slate-900">{row.metric}</td>
                                            <td className="py-4 text-slate-400">{row.fy22}</td>
                                            <td className="py-4 text-slate-400">{row.fy23}</td>
                                            <td className="py-4 text-slate-800">{row.fy24}</td>
                                            <td className="py-4"><Sparkline values={row.trend} positive={row.metric !== 'Gross debt'} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>

                    <Panel title="Product Mix" eyebrow="Portfolio exposure" className="xl:col-span-5">
                        <div className="space-y-4">
                            {productMix.map((item) => (
                                <div key={item.label}>
                                    <div className="mb-1 flex justify-between text-xs"><span className="text-slate-600">{item.label}</span><span className="text-slate-500">{item.value}%</span></div>
                                    <ProgressBar value={item.value} tone={item.tone} />
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>

                <div className="grid gap-6 xl:grid-cols-12">
                    <Panel title="Export Destination Heatmap" eyebrow="Share of tracked exports" className="xl:col-span-5">
                        <div className="grid grid-cols-2 gap-3">
                            {destinations.map((item) => (
                                <div key={item.market} className="rounded-lg rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between text-xs"><span className="font-bold text-slate-800">{item.market}</span><span className="text-blue-600">{item.value}%</span></div>
                                    <div className="mt-3"><ProgressBar value={item.value * 3} tone="cyan" /></div>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    <Panel title="Customer Mapping" eyebrow="Relationship graph" className="xl:col-span-7">
                        <div className="relative h-80 rounded-xl rounded-xl border border-slate-200 bg-slate-50">
                            <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-center text-xs font-black text-blue-700 shadow-[0_0_40px_rgba(34,211,238,0.16)]">
                                Aarti Industries
                            </div>
                            {buyers.map((buyer) => (
                                <div key={buyer.name} className="absolute rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-md" style={{ left: buyer.x, top: buyer.y }}>
                                    <p className="text-sm font-bold text-slate-900">{buyer.name}</p>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{buyer.tier}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Panel title="News Feed and Risk Profile" eyebrow="Events">
                        <div className="space-y-3">
                            {[
                                ['CPCB compliance notice issued for shared industrial belt discharge review', 'Regulatory', 'amber'],
                                ['Brownfield capacity expansion tender appears in EPC procurement signals', 'Capacity', 'rose'],
                                ['Management commentary shifts toward higher-margin custom synthesis', 'Financial', 'cyan'],
                            ].map(([title, type, tone]) => (
                                <div key={title} className="rounded-lg rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <StatusBadge tone={tone as 'amber'}>{type}</StatusBadge>
                                    <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    <Panel title="AI Strategic Insights" eyebrow="Consulting response">
                        <div className="space-y-4 text-sm leading-6 text-slate-600">
                            <p><Brain className="mr-2 inline h-4 w-4 text-blue-600" />Defend BASF and Lanxess with a 90-day technical qualification bundle before Aarti's expanded capacity reaches commercial output.</p>
                            <p><Factory className="mr-2 inline h-4 w-4 text-amber-300" />Use plant reliability and REACH documentation as the wedge; price-only responses will compress margin without reducing switching risk.</p>
                            <p><Globe2 className="mr-2 inline h-4 w-4 text-emerald-300" />Open a Rotterdam buffer-stock option for two EU accounts to neutralize lead-time concerns.</p>
                        </div>
                    </Panel>
                </div>
            </div>
        </PremiumShell>
    )
}

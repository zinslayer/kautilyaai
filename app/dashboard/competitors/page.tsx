"use client"

import { useState } from 'react'
import { AlertTriangle, BarChart3, Brain, Building2, Database, FileSearch, Radio, Ship, Users } from 'lucide-react'
import { ActionLink, MetricCard, Panel, PremiumShell, ProgressBar, SegmentedControl, Sparkline, StatusBadge } from '@/components/premium/Studio'

const companies = [
    { id: 'aarti-industries', name: 'Aarti Industries Ltd.', sector: 'Specialty chemicals', threat: 88, trend: [28, 31, 27, 36, 42, 47], signal: 'Dahej expansion tender matched to BASF lane', market: 'Germany, US, Japan', tone: 'rose' as const },
    { id: 'deepak-nitrite', name: 'Deepak Nitrite', sector: 'Phenolics and intermediates', threat: 74, trend: [22, 25, 31, 30, 34, 39], signal: 'Nitrotoluene export price compression', market: 'EU, Korea, UAE', tone: 'amber' as const },
    { id: 'gujarat-fluorochem', name: 'Gujarat Fluorochem', sector: 'Fluoropolymers', threat: 67, trend: [18, 21, 20, 26, 25, 29], signal: 'New EV separator buyer inferred', market: 'US, China, Singapore', tone: 'amber' as const },
    { id: 'navin-fluorine', name: 'Navin Fluorine', sector: 'CRAMS and HPP', threat: 53, trend: [20, 18, 21, 19, 23, 24], signal: 'FDA DMF status renewed', market: 'US, Switzerland', tone: 'cyan' as const },
    { id: 'srfltd', name: 'SRF Ltd.', sector: 'Packaging and chemicals', threat: 46, trend: [30, 28, 26, 24, 22, 23], signal: 'Freight exposure stabilizing', market: 'ASEAN, EU', tone: 'emerald' as const },
]

const alerts = [
    { priority: 'Critical', source: 'BSE filing', title: 'Aarti board approves specialty chemical brownfield expansion', text: 'Capacity signal overlaps two German accounts in your active pipeline.', tone: 'rose' as const },
    { priority: 'High', source: 'AIS + bill of lading', title: 'Deepak Nitrite shipment velocity up 18% on Hamburg route', text: 'Price-led market share push likely for mono nitrotoluene and allied intermediates.', tone: 'amber' as const },
    { priority: 'Medium', source: 'CDSCO', title: 'Navin Fluorine intermediate dossier accepted', text: 'Regulatory readiness improves US pharma customer access.', tone: 'cyan' as const },
    { priority: 'Monitor', source: 'DGTR tracker', title: 'Safeguard duty consultation opened for fluoropolymer inputs', text: 'Potential landed-cost advantage for domestic supply contracts.', tone: 'emerald' as const },
]

const signalMix = [
    { label: 'Trade flow', value: 34, tone: 'cyan' as const },
    { label: 'Capacity', value: 26, tone: 'indigo' as const },
    { label: 'Customer', value: 18, tone: 'emerald' as const },
    { label: 'Regulatory', value: 14, tone: 'amber' as const },
    { label: 'Financial', value: 8, tone: 'rose' as const },
]

export default function CompetitorWatchlistPage() {
    const tabs = ['All signals', 'Trade flows', 'Pricing', 'Expansion', 'Regulatory', 'Financial']
    const [activeTab, setActiveTab] = useState(tabs[0])

    return (
        <PremiumShell
            title="Competitor Watchlist"
            subtitle="Live competitive intelligence for Indian specialty manufacturers, with simulated consulting signals, export trends, and account-risk actions."
            actions={<ActionLink href="/dashboard/competitors/aarti-industries">Open Aarti deep-dive</ActionLink>}
        >
            <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard label="Tracked companies" value="42" detail="7 moved materially this week" icon={<Users className="h-5 w-5" />} />
                    <MetricCard label="Alerts" value="128" detail="18 high-confidence signals" icon={<Radio className="h-5 w-5" />} tone="indigo" />
                    <MetricCard label="Priority threats" value="6" detail="Direct overlap with target accounts" icon={<AlertTriangle className="h-5 w-5" />} tone="rose" />
                    <MetricCard label="Export shift" value="+11.4%" detail="90-day weighted average" icon={<Ship className="h-5 w-5" />} tone="emerald" />
                </div>

                <SegmentedControl items={tabs} active={activeTab} onChange={setActiveTab} />

                <div className="grid gap-6 xl:grid-cols-12">
                    <Panel title="Tracked Companies" eyebrow={activeTab} className="xl:col-span-8">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3">Company</th>
                                        <th className="pb-3">Threat</th>
                                        <th className="pb-3">Export trend</th>
                                        <th className="pb-3">Last signal</th>
                                        <th className="pb-3">Markets</th>
                                        <th className="pb-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/80">
                                    {companies.map((company) => (
                                        <tr key={company.id} className="group">
                                            <td className="py-4 pr-4">
                                                <div className="font-bold text-slate-900 group-hover:text-blue-600">{company.name}</div>
                                                <div className="text-xs text-slate-500">{company.sector}</div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="flex min-w-32 items-center gap-3">
                                                    <div className="w-24"><ProgressBar value={company.threat} tone={company.tone} /></div>
                                                    <span className="text-xs font-black text-slate-600">{company.threat}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4"><Sparkline values={company.trend} positive={company.trend.at(-1)! >= company.trend[0]} /></td>
                                            <td className="py-4 pr-4 text-xs text-slate-600">{company.signal}</td>
                                            <td className="py-4 pr-4 text-xs font-semibold text-slate-400">{company.market}</td>
                                            <td className="py-4"><ActionLink href={`/dashboard/competitors/${company.id}`}>Profile</ActionLink></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>

                    <div className="space-y-6 xl:col-span-4">
                        <Panel title="Live Alert Feed" eyebrow="Sources">
                            <div className="space-y-3">
                                {alerts.map((alert) => (
                                    <div key={alert.title} className="rounded-lg rounded-lg border border-slate-200 bg-slate-50 p-4">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <StatusBadge tone={alert.tone}>{alert.priority}</StatusBadge>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{alert.source}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                                        <p className="mt-1 text-xs leading-5 text-slate-400">{alert.text}</p>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="Signal Types" eyebrow="Breakdown">
                            <div className="space-y-4">
                                {signalMix.map((signal) => (
                                    <div key={signal.label}>
                                        <div className="mb-1 flex justify-between text-xs">
                                            <span className="font-semibold text-slate-600">{signal.label}</span>
                                            <span className="text-slate-500">{signal.value}%</span>
                                        </div>
                                        <ProgressBar value={signal.value} tone={signal.tone} />
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="AI Consulting Actions" eyebrow="Next best move">
                            <div className="grid gap-3">
                                {['Generate threat report', 'Account risk analysis', 'Price counter-position', 'Customer switching memo'].map((item) => (
                                    <button key={item} className="flex items-center justify-between rounded-lg flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600">
                                        <span className="flex items-center gap-2"><Brain className="h-4 w-4" />{item}</span>
                                        <FileSearch className="h-4 w-4" />
                                    </button>
                                ))}
                            </div>
                        </Panel>
                    </div>
                </div>
            </div>
        </PremiumShell>
    )
}

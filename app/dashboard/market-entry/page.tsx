"use client"

import { useState } from 'react'
import { AlertTriangle, Calendar, CheckCircle, Compass, Mail, Percent, Search, Target, Users } from 'lucide-react'
import { MetricCard, Panel, PremiumShell, ProgressBar, SegmentedControl, StatusBadge } from '@/components/premium/Studio'

const reports = {
    'Mono Nitrotoluene to Germany': {
        product: 'Mono Nitrotoluene',
        market: 'Germany',
        verdict: 'Recommended entry: strong opportunity',
        score: 86,
        customers: ['BASF SE', 'Lanxess AG', 'Evonik Industries', 'Clariant'],
        risks: ['6.5% MFN duty until India-EU FTA', 'REACH registration 12-18 month timeline', 'Incumbent qualification cycle'],
    },
    'Lithium Cell Packs to United States': {
        product: 'Lithium Cell Packs',
        market: 'United States',
        verdict: 'Recommended entry: high potential with strict compliance',
        score: 78,
        customers: ['Ford Motor Co.', 'Tesla Energy', 'Fluence', 'Rivian'],
        risks: ['IRA mineral sourcing audit', 'UL 1973 safety certification', 'China-origin component exposure'],
    },
}

const scoring = [
    { label: 'Demand size', value: 92, tone: 'emerald' as const },
    { label: 'Competitive intensity', value: 62, tone: 'amber' as const },
    { label: 'Price premium', value: 81, tone: 'cyan' as const },
    { label: 'Logistics fit', value: 78, tone: 'indigo' as const },
    { label: 'Regulatory ease', value: 66, tone: 'amber' as const },
]

export default function MarketEntryPage() {
    const [selected, setSelected] = useState<keyof typeof reports>('Mono Nitrotoluene to Germany')
    const [draft, setDraft] = useState('')
    const report = reports[selected]

    function makeDraft(customer: string) {
        setDraft(`Subject: ${report.product} supply discussion for ${customer}\n\nDear ${customer} procurement team,\n\nKautilyaAI has identified a strong fit between your sourcing patterns in ${report.market} and our India-based ${report.product} export capability. We can support qualification with REACH-ready documentation, competitive landed pricing, and a 12-month ramp plan designed around your supplier approval cycle.\n\nCould we schedule a short technical sourcing discussion next week?\n\nRegards,\nKautilyaAI Export Strategy Team`)
    }

    return (
        <PremiumShell title="Market Entry Reports" subtitle="Interactive report generator for export market attractiveness, customer targeting, risk planning, and outreach drafts.">
            <div className="space-y-8">
                <Panel>
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                        <label className="block">
                            <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Product and destination</span>
                            <select value={selected} onChange={(e) => { setSelected(e.target.value as keyof typeof reports); setDraft('') }} className="w-full rounded-lg select-field font-bold">
                                {Object.keys(reports).map((item) => <option key={item}>{item}</option>)}
                            </select>
                        </label>
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 text-xs font-black text-slate-950 transition hover:bg-cyan-300"><Search className="h-4 w-4" />Generate report</button>
                    </div>
                </Panel>

                <Panel className="border-emerald-400/20 bg-emerald-400/10">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <StatusBadge tone="emerald">Verdict</StatusBadge>
                            <h2 className="mt-3 text-2xl font-black text-slate-50">{report.verdict}</h2>
                            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                                {report.market} shows a compelling entry window for {report.product}. Demand is deep, procurement teams are diversifying from China-heavy lanes, and Indian supplier penetration remains low enough for a focused challenger strategy.
                            </p>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                            <p className="text-xs font-black uppercase tracking-wider text-emerald-300">Overall score</p>
                            <p className="mt-2 text-5xl font-black text-slate-50">{report.score}</p>
                        </div>
                    </div>
                </Panel>

                <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard label="TAM" value={selected.includes('Mono') ? 'EUR 340M' : '$4.2B'} detail="Annual import pool" icon={<Target className="h-5 w-5" />} />
                    <MetricCard label="SAM" value={selected.includes('Mono') ? 'EUR 18-28M' : '$90-140M'} detail="3-year realistic capture" icon={<Percent className="h-5 w-5" />} tone="emerald" />
                    <MetricCard label="First revenue" value="6-9 mo" detail="With accelerated qualification" icon={<Calendar className="h-5 w-5" />} tone="amber" />
                    <MetricCard label="Target buyers" value="14" detail="4 high-priority accounts" icon={<Users className="h-5 w-5" />} tone="indigo" />
                </div>

                <div className="grid gap-6 xl:grid-cols-12">
                    <Panel title="Market Scoring" eyebrow="Opportunity model" className="xl:col-span-5">
                        <div className="space-y-4">
                            {scoring.map((item) => (
                                <div key={item.label}>
                                    <div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-slate-600">{item.label}</span><span className="font-bold text-blue-600">{item.value}/100</span></div>
                                    <ProgressBar value={item.value} tone={item.tone} />
                                </div>
                            ))}
                        </div>
                    </Panel>

                    <Panel title="Top Target Customers" eyebrow="Priority cards" className="xl:col-span-7">
                        <div className="grid gap-4 md:grid-cols-2">
                            {report.customers.map((customer, index) => (
                                <div key={customer} className="rounded-xl rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex items-center justify-between"><StatusBadge tone={index < 2 ? 'emerald' : 'cyan'}>Priority {index + 1}</StatusBadge><Compass className="h-4 w-4 text-slate-500" /></div>
                                    <h3 className="mt-4 text-lg font-black text-slate-900">{customer}</h3>
                                    <p className="mt-2 text-xs leading-5 text-slate-400">Procurement fit detected from import patterns, substitution pressure, and likely vendor diversification mandates.</p>
                                    <button onClick={() => makeDraft(customer)} className="btn-secondary mt-4 w-full py-2 text-xs"><Mail className="h-4 w-4" />Draft outreach email</button>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>

                {draft && (
                    <Panel title="Automated Outreach Draft" eyebrow="Editable">
                        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="input-field h-64 font-mono text-xs leading-5" />
                    </Panel>
                )}

                <div className="grid gap-6 xl:grid-cols-2">
                    <Panel title="Landscape and Risks" eyebrow="Risk register">
                        <div className="space-y-3">
                            {report.risks.map((risk, index) => (
                                <div key={risk} className="flex gap-3 rounded-lg rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <AlertTriangle className={`mt-0.5 h-4 w-4 ${index === 0 ? 'text-rose-300' : 'text-amber-300'}`} />
                                    <p className="text-sm text-slate-600">{risk}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>
                    <Panel title="12-Month Action Plan" eyebrow="Launch timeline">
                        <div className="grid gap-3 md:grid-cols-4">
                            {[
                                ['1-2', 'Regulatory dossier'],
                                ['3-5', 'Samples and lab trials'],
                                ['6-8', 'Tender quotes'],
                                ['9-12', 'Scale shipments'],
                            ].map(([month, text]) => (
                                <div key={month} className="rounded-xl rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-black text-blue-600">{month}</div>
                                    <p className="mt-4 text-sm font-bold text-slate-800">{text}</p>
                                    <CheckCircle className="mt-4 h-4 w-4 text-emerald-300" />
                                </div>
                            ))}
                        </div>
                    </Panel>
                </div>
            </div>
        </PremiumShell>
    )
}

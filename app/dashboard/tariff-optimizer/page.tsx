"use client"

import { useMemo, useState } from 'react'
import { AlertTriangle, Calculator, CheckCircle, FileText, Percent, Route, Scale, Search } from 'lucide-react'
import { MetricCard, Panel, PremiumShell, ProgressBar, SegmentedControl, StatusBadge } from '@/components/premium/Studio'

const saved = [
    { product: 'Mono Nitrotoluene', hs: '2904.20.10', route: 'ASEAN FTA', rate: '19.65%', status: 'Optimized' },
    { product: 'Chlorobenzene', hs: '2903.61.00', route: 'MFN', rate: '41.45%', status: 'Review' },
    { product: 'Acetic Anhydride', hs: '2915.24.00', route: 'Japan CEPA', rate: '18.00%', status: 'Optimized' },
]

export default function TariffOptimizerPage() {
    const tabs = ['HS Classifier', 'FTA Optimizer', 'Landed Cost', 'Duty Drawback', 'Tariff Alerts']
    const [activeTab, setActiveTab] = useState(tabs[0])
    const [description, setDescription] = useState('Mono Nitrotoluene technical grade')
    const [cas, setCas] = useState('99-08-1')
    const [origin, setOrigin] = useState('Singapore - ASEAN FTA')
    const [cif, setCif] = useState(1000000)
    const [freight, setFreight] = useState(45000)
    const [cha, setCha] = useState(15000)
    const [inland, setInland] = useState(25000)

    const classification = useMemo(() => {
        const text = description.toLowerCase()
        if (text.includes('chloro')) return { hs: '2903.61.00', bcd: 7.5, add: 15.2, route: 'No preferential route detected', confidence: 82 }
        if (text.includes('acetic')) return { hs: '2915.24.00', bcd: 0, add: 0, route: 'Japan CEPA preferential BCD', confidence: 91 }
        return { hs: '2904.20.10', bcd: 1.5, add: 0, route: 'ASEAN FTA preferential BCD', confidence: 94 }
    }, [description])

    const landed = useMemo(() => {
        const bcdRate = origin.includes('Japan') ? 0 : origin.includes('ASEAN') ? 0.015 : 0.075
        const bcd = cif * bcdRate
        const sws = bcd * 0.1
        const igst = (cif + bcd + sws) * 0.18
        const totalDuty = bcd + sws + igst
        return { bcdRate, bcd, sws, igst, totalDuty, total: cif + totalDuty + freight + cha + inland }
    }, [origin, cif, freight, cha, inland])

    return (
        <PremiumShell
            title="Tariff Optimizer"
            subtitle="Interactive HS classification, FTA route comparison, landed-cost modeling, duty drawback tracking, and tariff alert simulations."
        >
            <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard label="Annual savings" value="INR 4.2 Cr" detail="Across 3 optimized products" icon={<Percent className="h-5 w-5" />} tone="emerald" />
                    <MetricCard label="Average duty" value="9.8%" detail="Can reduce to 3.2%" icon={<Scale className="h-5 w-5" />} />
                    <MetricCard label="FTA routes" value="4 Active" detail="ASEAN, Japan, UAE, Australia" icon={<Route className="h-5 w-5" />} tone="indigo" />
                    <MetricCard label="Unclaimed drawback" value="INR 68 L" detail="Two quarters eligible" icon={<AlertTriangle className="h-5 w-5" />} tone="amber" />
                </div>

                <SegmentedControl items={tabs} active={activeTab} onChange={setActiveTab} />

                {activeTab === 'HS Classifier' && (
                    <div className="grid gap-6 xl:grid-cols-12">
                        <Panel title="Product Classifier" eyebrow="Input" className="xl:col-span-5">
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-400">Product description</label>
                                <input value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" />
                                <label className="block text-xs font-bold text-slate-400">CAS number</label>
                                <input value={cas} onChange={(e) => setCas(e.target.value)} className="input-field" />
                                <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-cyan-300"><Search className="h-4 w-4" />Classify HS code</button>
                            </div>
                        </Panel>
                        <Panel title="Recommended Classification" eyebrow="AI customs brain" className="xl:col-span-7">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">HS code</p>
                                    <p className="mt-2 text-3xl font-black text-slate-50">{classification.hs}</p>
                                    <p className="mt-2 text-sm text-slate-600">{classification.route}</p>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <Row label="BCD" value={`${classification.bcd}%`} />
                                    <Row label="SWS" value={`${(classification.bcd * 0.1).toFixed(2)}%`} />
                                    <Row label="IGST" value="18%" />
                                    <Row label="Anti-dumping duty" value={classification.add ? `${classification.add}%` : 'Nil'} />
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="mb-2 flex justify-between text-xs"><span className="text-slate-400">Classification confidence</span><span className="font-bold text-blue-600">{classification.confidence}%</span></div>
                                <ProgressBar value={classification.confidence} />
                            </div>
                            <div className="mt-6 overflow-x-auto">
                                <table className="w-full min-w-[560px] text-left text-sm">
                                    <tbody className="divide-y divide-slate-800">
                                        {saved.map((item) => (
                                            <tr key={item.product}>
                                                <td className="py-3 font-bold text-slate-800">{item.product}</td>
                                                <td className="py-3 font-mono text-slate-400">{item.hs}</td>
                                                <td className="py-3 text-slate-400">{item.route}</td>
                                                <td className="py-3 text-blue-600">{item.rate}</td>
                                                <td className="py-3"><StatusBadge tone={item.status === 'Optimized' ? 'emerald' : 'amber'}>{item.status}</StatusBadge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Panel>
                    </div>
                )}

                {activeTab === 'FTA Optimizer' && (
                    <Panel title="FTA Savings Routes" eyebrow="Rules of origin">
                        <div className="grid gap-4 md:grid-cols-4">
                            {[
                                ['ASEAN FTA', 'INR 2.1 Cr/Yr', '35% local value addition', 84],
                                ['Japan CEPA', 'INR 74 L/Yr', 'CTH transformation plus certificate', 72],
                                ['UAE CEPA', 'INR 1.1 Cr/Yr', '40% value addition in UAE', 68],
                                ['Australia ECTA', 'INR 32 L/Yr', 'Origin declaration required', 55],
                            ].map(([name, saving, rule, score]) => (
                                <div key={name as string} className="rounded-xl rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <StatusBadge tone="cyan">Active</StatusBadge>
                                    <h3 className="mt-4 text-lg font-black text-slate-900">{name}</h3>
                                    <p className="mt-1 text-sm font-bold text-emerald-300">{saving}</p>
                                    <p className="mt-3 min-h-10 text-xs leading-5 text-slate-400">{rule}</p>
                                    <div className="mt-4"><ProgressBar value={score as number} tone="emerald" /></div>
                                </div>
                            ))}
                        </div>
                    </Panel>
                )}

                {activeTab === 'Landed Cost' && (
                    <div className="grid gap-6 xl:grid-cols-12">
                        <Panel title="Calculator Inputs" eyebrow="Scenario" className="xl:col-span-5">
                            <div className="space-y-4">
                                <Select label="Origin route" value={origin} onChange={setOrigin} options={['Singapore - ASEAN FTA', 'Japan - CEPA', 'China - MFN Rate']} />
                                <NumberInput label="CIF value" value={cif} onChange={setCif} />
                                <NumberInput label="Freight and port handling" value={freight} onChange={setFreight} />
                                <NumberInput label="CHA clearance fees" value={cha} onChange={setCha} />
                                <NumberInput label="Inland logistics" value={inland} onChange={setInland} />
                            </div>
                        </Panel>
                        <Panel title="Landed Cost Breakdown" eyebrow="Live calculation" className="xl:col-span-7">
                            <div className="space-y-4">
                                <Row label={`BCD (${(landed.bcdRate * 100).toFixed(1)}%)`} value={`INR ${Math.round(landed.bcd).toLocaleString('en-IN')}`} />
                                <Row label="SWS (10% of BCD)" value={`INR ${Math.round(landed.sws).toLocaleString('en-IN')}`} />
                                <Row label="IGST (18%)" value={`INR ${Math.round(landed.igst).toLocaleString('en-IN')}`} />
                                <Row label="Total customs duty" value={`INR ${Math.round(landed.totalDuty).toLocaleString('en-IN')}`} />
                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">True landed sourcing cost</p>
                                    <p className="mt-2 text-4xl font-black text-slate-50">INR {Math.round(landed.total).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </Panel>
                    </div>
                )}

                {activeTab === 'Duty Drawback' && (
                    <Panel title="Drawback Compliance Tracker" eyebrow="Claims">
                        <div className="grid gap-4 md:grid-cols-2">
                            {[
                                ['SB-938109', '120 MT Nitrotoluene to Rotterdam', '1.2%', 'INR 24.2 L', '12 Nov 2026'],
                                ['SB-440212', '85 MT Specialty Polymers to Busan', '1.5%', 'INR 44.2 L', '22 Dec 2026'],
                            ].map(([bill, item, rate, value, date]) => (
                                <div key={bill} className="rounded-xl rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex items-center justify-between"><h3 className="font-mono text-sm font-black text-slate-900">{bill}</h3><StatusBadge tone="amber">Unclaimed</StatusBadge></div>
                                    <p className="mt-3 text-sm text-slate-600">{item}</p>
                                    <div className="mt-4 grid grid-cols-3 gap-3 text-xs"><Row label="Rate" value={rate} /><Row label="Value" value={value} /><Row label="Deadline" value={date} /></div>
                                </div>
                            ))}
                        </div>
                    </Panel>
                )}

                {activeTab === 'Tariff Alerts' && (
                    <Panel title="Regulatory Customs Alerts" eyebrow="Watchlist">
                        <div className="space-y-3">
                            {[
                                ['MFN increase', 'Battery management unit BCD increased from 5.0% to 7.5% in latest budget scenario.', 'rose'],
                                ['Anti-dumping investigation', 'DGTR probe opened into specialty yarn imports from Bangladesh and Vietnam.', 'amber'],
                                ['FTA opportunity', 'Australia ECTA phase reduction lowers copper ore duty from 2.5% to 0.5%.', 'emerald'],
                            ].map(([title, text, tone]) => (
                                <div key={title} className="rounded-xl rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <StatusBadge tone={tone as 'rose'}>{title}</StatusBadge>
                                    <p className="mt-3 text-sm text-slate-600">{text}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>
                )}
            </div>
        </PremiumShell>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return <div className="flex items-center justify-between gap-4 rounded-lg rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm"><span className="text-slate-500">{label}</span><span className="text-right font-bold text-slate-900">{value}</span></div>
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-400">{label}</span>
            <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="input-field" />
        </label>
    )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-400">{label}</span>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="input-field">
                {options.map((option) => <option key={option}>{option}</option>)}
            </select>
        </label>
    )
}

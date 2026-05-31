'use client'

import Link from 'next/link'
import {
    ArrowRight,
    BarChart3,
    Building2,
    Compass,
    FileSearch,
    Landmark,
    Network,
    Radar,
    Satellite,
    Search,
    Ship,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react'
import { MarketingHeader } from '@/components/layout/Headers'

const heroProofPoints = [
    { value: '₹2–5 Cr', label: 'Average Annual Duty Savings' },
    { value: '50M+', label: 'Global Shipment Signals Analyzed' },
    { value: 'Real-Time', label: 'Competitor Intelligence Alerts' },
    { value: '6', label: 'Industry Intelligence Networks' },
]

const steps = [
    {
        number: '1',
        title: 'India lost customs visibility',
        description:
            'Post-ban trade teams operate without shipment-level government feeds. Strategic decisions stall when the signal layer disappears.',
    },
    {
        number: '2',
        title: 'KautilyaAI reconstructs intelligence',
        description:
            'Alternative data networks fuse BoL, AIS, satellite, MCA, and corporate signals into a single trade intelligence operating system.',
    },
    {
        number: '3',
        title: 'Consulting-grade decisions at scale',
        description:
            'Monitor competitors, optimize duties, and expand markets with enterprise intelligence—not spreadsheet reconstruction.',
    },
]

const intelligenceFeatures = [
    {
        icon: <Radar className="h-6 w-6" />,
        title: 'Competitor Intelligence',
        description:
            'Live threat scoring, buyer displacement signals, and regulatory alerts. Mission-critical visibility when rivals move before the market reacts.',
        tone: 'green' as const,
    },
    {
        icon: <Building2 className="h-6 w-6" />,
        title: 'Company Deep Dive',
        description:
            'Strategic company profiles with MCA filings, portfolio shifts, management moves, and procurement signals—updated continuously, not quarterly.',
        tone: 'orange' as const,
    },
    {
        icon: <Landmark className="h-6 w-6" />,
        title: 'Tariff Optimizer',
        description:
            'FTA routing, HS classification, and landed-cost intelligence surface duty leakage and drawback opportunities worth crores annually.',
        tone: 'purple' as const,
    },
    {
        icon: <FileSearch className="h-6 w-6" />,
        title: 'Market Entry Simulator',
        description:
            'Country-level attractiveness, buyer mapping, tariff exposure, and launch sequencing—consulting-grade market expansion intelligence in minutes.',
        tone: 'pink' as const,
    },
    {
        icon: <Network className="h-6 w-6" />,
        title: 'Sector Intelligence',
        description:
            'Six industry intelligence networks monitor chemicals, pharma, agri, textiles, electronics, and metals for policy and value-chain shifts.',
        tone: 'indigo' as const,
    },
    {
        icon: <Satellite className="h-6 w-6" />,
        title: 'Alternative Data Intelligence',
        description:
            'Satellite, AIS, and global bill-of-lading layers reconstruct hidden trade flows when customs visibility ends.',
        tone: 'blue' as const,
    },
]

const supportingCapabilities = [
    {
        icon: <Zap className="h-5 w-5" />,
        title: 'Trade Data Processing',
        description: 'Enterprise-grade ingestion and signal preparation for your proprietary datasets.',
        tone: 'blue' as const,
    },
    {
        icon: <BarChart3 className="h-5 w-5" />,
        title: 'Financial Trade Analysis',
        description: 'Weighted pricing, EXIM summaries, and financial reconstruction for board-ready outputs.',
        tone: 'purple' as const,
    },
    {
        icon: <TrendingUp className="h-5 w-5" />,
        title: 'Corporate Research Layer',
        description: 'B2B intelligence and company research workflows supporting strategic account planning.',
        tone: 'green' as const,
    },
    {
        icon: <Network className="h-5 w-5" />,
        title: 'Value Chain Mapping',
        description: 'Interactive value-chain visualization for supply and demand intelligence.',
        tone: 'orange' as const,
    },
    {
        icon: <Compass className="h-5 w-5" />,
        title: 'Demand & Market Modeling',
        description: 'Downstream application-based demand modeling for expansion and capacity decisions.',
        tone: 'pink' as const,
    },
]

const toneClasses = {
    blue: 'icon-box-blue',
    green: 'icon-box-green',
    purple: 'icon-box-purple',
    orange: 'icon-box-orange',
    pink: 'icon-box-pink',
    indigo: 'icon-box-indigo',
}

export default function HomePage() {
    return (
        <div className="home-page min-h-screen overflow-x-hidden">
            <MarketingHeader />

            <main>
                <section id="platform" className="landing-hero relative overflow-hidden">
                    <div className="landing-hero-orb landing-hero-orb--left" aria-hidden="true" />
                    <div className="landing-hero-orb landing-hero-orb--right" aria-hidden="true" />

                    <div className="landing-hero-container app-container relative py-16 lg:py-24">
                        <div className="landing-hero-grid grid items-center gap-14 max-lg:grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
                            <div className="max-w-2xl">
                                <div className="badge-pill reveal-on-scroll mb-6">
                                    <Sparkles className="h-4 w-4 text-blue-600" />
                                    Trade intelligence operating system
                                </div>
                                <h1 className="landing-hero-title reveal-on-scroll" data-reveal-index="1">
                                    India&apos;s Trade Intelligence Operating System
                                </h1>
                                <p className="landing-hero-lead reveal-on-scroll mt-6" data-reveal-index="2">
                                    Monitor competitors, reconstruct hidden trade flows, optimize duties, and generate
                                    consulting-grade market intelligence using alternative data sources.
                                </p>
                                <div className="landing-hero-ctas reveal-on-scroll mt-9 flex flex-wrap gap-4" data-reveal-index="3">
                                    <a
                                        href="#early-access"
                                        data-modal-trigger="early-access"
                                        className="btn-primary px-7 py-3.5 text-base"
                                    >
                                        Request Early Access
                                        <ArrowRight className="h-5 w-5" />
                                    </a>
                                    <Link href="/dashboard" className="btn-secondary px-7 py-3.5 text-base">
                                        Explore Intelligence Platform
                                    </Link>
                                </div>
                            </div>

                            <HeroDashboard />
                        </div>

                        <div className="landing-proof-grid mt-14 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                            {heroProofPoints.map((point, index) => (
                                <ProofCard key={point.label} value={point.value} label={point.label} revealIndex={index} />
                            ))}
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="landing-steps-section landing-section-pad border-y py-16 lg:py-20">
                    <div className="app-container">
                        <SectionHeader
                            title="When customs visibility ends, strategic intelligence begins"
                            subtitle="KautilyaAI reconstructs trade intelligence using alternative data—built for executive teams who cannot afford blind spots."
                        />
                        <div className="landing-steps-grid grid grid-cols-1 gap-6 md:grid-cols-3">
                            {steps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className="surface-card landing-step-card reveal-on-scroll relative pt-10"
                                    data-reveal-index={index}
                                >
                                    <div className="landing-step-number absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white">
                                        {step.number}
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-[#0f1423]">{step.title}</h3>
                                    <p className="text-sm leading-7 text-[#4a5568]">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="sectors" className="landing-features-section landing-section-pad py-16 lg:py-20">
                    <div className="app-container">
                        <SectionHeader
                            title="Strategic intelligence infrastructure for global trade leaders"
                            subtitle="Competitor monitoring, duty optimization, market expansion, and alternative data—unified for revenue growth and competitive advantage."
                        />
                        <div className="landing-features-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {intelligenceFeatures.map((feature, index) => (
                                <div
                                    key={feature.title}
                                    className="surface-card landing-feature-card reveal-on-scroll cursor-pointer"
                                    data-feature={feature.title}
                                    data-modal-trigger="feature"
                                    data-reveal-index={index}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            event.currentTarget.click()
                                        }
                                    }}
                                >
                                    <div className={`mb-4 ${toneClasses[feature.tone]}`}>{feature.icon}</div>
                                    <p className="landing-feature-module-label mb-2 text-[11px] font-bold uppercase">
                                        Strategic module {index + 1}
                                    </p>
                                    <h3 className="landing-feature-title mb-2 text-lg text-[#0f1423]">{feature.title}</h3>
                                    <p className="text-sm leading-7 text-[#4a5568]">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="landing-support-section landing-section-pad border-t py-14">
                    <div className="app-container">
                        <SectionHeader
                            title="Supporting data operations"
                            subtitle="Proprietary trade data processing and financial reconstruction—available as infrastructure beneath the intelligence layer."
                        />
                        <div className="landing-support-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {supportingCapabilities.map((capability, index) => (
                                <div
                                    key={capability.title}
                                    className="landing-support-card reveal-on-scroll rounded-xl px-5 py-4"
                                    data-reveal-index={index}
                                >
                                    <div className={`mb-3 inline-flex ${toneClasses[capability.tone]} scale-90`}>
                                        {capability.icon}
                                    </div>
                                    <h3 className="text-base font-semibold text-[#0f1423]">{capability.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-[#4a5568]">{capability.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="pricing" className="landing-cta-section landing-section-pad py-16 lg:py-20">
                    <div className="app-container text-center">
                        <h2 className="landing-cta-heading reveal-on-scroll mx-auto max-w-4xl text-3xl text-white md:text-4xl lg:text-5xl">
                            Mission-critical intelligence infrastructure
                            <span className="landing-cta-heading-accent mt-2 block">
                                Built for enterprises investing ₹10–50 lakh annually in strategic trade advantage
                            </span>
                        </h2>
                        <p className="landing-section-subtitle reveal-on-scroll mx-auto mt-6 max-w-2xl">
                            Alternative data networks, competitor monitoring, and consulting-grade insights—without
                            rebuilding intelligence in spreadsheets.
                        </p>
                        <div className="landing-cta-actions reveal-on-scroll mt-8 flex flex-wrap justify-center gap-4">
                            <a
                                href="#early-access"
                                data-modal-trigger="early-access"
                                className="landing-cta-btn-primary inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-slate-900"
                            >
                                Request Early Access
                                <ArrowRight className="h-5 w-5" />
                            </a>
                            <Link
                                href="/dashboard"
                                className="landing-cta-btn-outline inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-white"
                            >
                                Explore Intelligence Platform
                            </Link>
                        </div>
                        <p className="landing-cta-note mt-5 text-sm font-medium text-slate-500">
                            Onboarding enterprise trade teams in chemicals, pharma, and agri sectors
                        </p>
                    </div>
                </section>
            </main>

            <footer className="landing-footer py-8">
                <div className="app-container flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
                    <p>© {new Date().getFullYear()} KautilyaAI. All rights reserved.</p>
                    <p>Strategic trade intelligence—named after Kautilya, architect of Indian statecraft and commerce.</p>
                </div>
            </footer>
        </div>
    )
}

function ProofCard({ value, label, revealIndex }: { value: string; label: string; revealIndex: number }) {
    return (
        <div
            className="landing-proof-card reveal-on-scroll rounded-xl px-6 py-5"
            data-reveal-index={revealIndex}
        >
            <p className="landing-proof-value text-2xl md:text-[1.65rem]">{value}</p>
            <p className="landing-proof-label mt-2 text-sm font-medium leading-snug">{label}</p>
        </div>
    )
}

function HeroDashboard() {
    return (
        <div className="landing-hero-card-wrap reveal-on-scroll" data-reveal-index="2">
            <div className="landing-hero-card-glow" aria-hidden="true" />
            <div className="landing-hero-card relative rounded-2xl p-6 text-white">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Executive command layer
                        </p>
                        <h2 className="text-xl font-semibold tracking-tight">Intelligence Overview</h2>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                        Live signals
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <MiniMetric label="Signals processed" value="12.8M" lift="+18.2%" />
                    <MiniMetric label="Entities monitored" value="4,327" lift="+6.4%" />
                    <MiniMetric label="Client savings" value="₹147 Cr" lift="Annualized" />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="landing-hero-panel rounded-xl p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold">Competitor intelligence</p>
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <ThreatRow icon={<Users className="h-4 w-4" />} name="Buyer displacement — Germany" level="High" />
                        <ThreatRow icon={<Ship className="h-4 w-4" />} name="Capacity expansion signal" level="High" />
                        <ThreatRow icon={<Radar className="h-4 w-4" />} name="Regulatory exposure flagged" level="Medium" />
                    </div>

                    <div className="landing-hero-panel rounded-xl p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-semibold">Reconstructed trade flows</p>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold">
                                92/100
                            </span>
                        </div>
                        <div className="relative h-36 overflow-hidden rounded-lg bg-slate-950/40">
                            <div className="absolute left-5 top-10 h-16 w-16 rounded-full bg-cyan-300/20 blur-xl" />
                            <div className="absolute right-8 top-8 h-20 w-20 rounded-full bg-blue-300/20 blur-xl" />
                            <div className="absolute inset-x-8 top-1/2 h-px bg-white/15" />
                            <div className="absolute left-12 top-16 h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_22px_rgba(165,243,252,0.9)]" />
                            <div className="absolute left-1/2 top-20 h-2 w-2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.85)]" />
                            <div className="absolute right-14 top-12 h-2 w-2 rounded-full bg-blue-200 shadow-[0_0_22px_rgba(191,219,254,0.9)]" />
                            <div className="absolute bottom-4 left-4 right-4 h-2 rounded-full bg-white/10">
                                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-300/90 to-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MiniMetric({ label, value, lift }: { label: string; value: string; lift: string }) {
    return (
        <div className="landing-hero-stat rounded-xl p-4">
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                <span className="landing-hero-lift landing-stat-badge rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    {lift}
                </span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-slate-300/70" />
            </div>
        </div>
    )
}

function ThreatRow({ icon, name, level }: { icon: React.ReactNode; name: string; level: string }) {
    const isHigh = level === 'High'

    return (
        <div className="landing-hero-stat mt-3 flex items-center justify-between gap-3 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-slate-200">
                <span className="text-slate-400">{icon}</span>
                <span className="text-xs font-medium">{name}</span>
            </div>
            <span
                className={`landing-stat-badge rounded-full px-2 py-1 text-[10px] font-bold ${
                    isHigh ? 'landing-threat-badge--high' : 'landing-threat-badge--medium'
                }`}
            >
                {level}
            </span>
        </div>
    )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="landing-section-header mx-auto mb-12 max-w-3xl text-center">
            <h2 className="landing-section-title reveal-on-scroll text-3xl md:text-4xl">{title}</h2>
            <p className="landing-section-subtitle reveal-on-scroll mt-4">{subtitle}</p>
        </div>
    )
}

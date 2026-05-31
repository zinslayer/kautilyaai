"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    ArrowRight,
    BarChart3,
    Building2,
    Calculator,
    Compass,
    Database,
    FileText,
    Globe2,
    Home,
    LayoutDashboard,
    Network,
    Radio,
    Scale,
    Satellite,
    Shield,
    TrendingUp,
    Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import FolderSelector from '@/components/FolderSelector'
import UploadWithFolderModal from '@/components/UploadWithFolderModal'
import CreateFolderModal from '@/components/CreateFolderModal'
import { AppShell, MetricCard } from '@/components/premium/Studio'
import { projectApi, ProjectDetail } from '@/lib/projectApi'

const executiveIntelligenceMetrics = [
    {
        label: 'Trade Signals Processed',
        value: '12.8M',
        detail: 'Alternative data layer · rolling 90d',
        icon: <Radio className="h-6 w-6" />,
        tone: 'blue' as const,
    },
    {
        label: 'Companies Monitored',
        value: '4,327',
        detail: 'Competitor & supplier watchlists',
        icon: <Building2 className="h-6 w-6" />,
        tone: 'green' as const,
    },
    {
        label: 'Intelligence Reports Generated',
        value: '18,542',
        detail: 'Consulting-grade outputs delivered',
        icon: <FileText className="h-6 w-6" />,
        tone: 'purple' as const,
    },
    {
        label: 'Estimated Client Savings',
        value: '₹147 Cr',
        detail: 'Duty optimization & trade efficiency',
        icon: <TrendingUp className="h-6 w-6" />,
        tone: 'indigo' as const,
    },
]

export default function DashboardPage() {
    useEffect(() => {
        console.debug('[DashboardPage] mounted')
        return () => console.debug('[DashboardPage] unmounted')
    }, [])
    const router = useRouter()
    const [selectedFolderId, setSelectedFolderId] = useState<string>('')
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [showCreateFolder, setShowCreateFolder] = useState(false)
    const [folderStats, setFolderStats] = useState<ProjectDetail | null>(null)

    useEffect(() => {
        if (selectedFolderId) {
            loadFolderStats()
        }
    }, [selectedFolderId])

    const loadFolderStats = async () => {
        try {
            const stats = await projectApi.getProject(selectedFolderId)
            setFolderStats(stats)
        } catch (error) {
            console.error('Failed to load folder stats:', error)
        }
    }

    const handleUploadSuccess = (datasetId?: string) => {
        if (datasetId) {
            router.push(`/dashboard/processing?datasetId=${datasetId}`)
        } else if (selectedFolderId) {
            loadFolderStats()
        }
    }

    const hasWorkspaceActivity =
        folderStats &&
        (folderStats.dataset_count > 0 || folderStats.report_count > 0 || folderStats.b2b_search_count > 0)

    return (
        <AppShell
            title="Trade Intelligence"
            titleHighlight="Command Center"
            subtitle="Monitor competitors, uncover hidden trade flows, identify market opportunities, and optimize global trade strategy from a single intelligence layer."
            badge="Executive Trade Intelligence Command Center"
            showNav
            actions={
                <>
                    <FolderSelector
                        selectedFolderId={selectedFolderId}
                        onFolderChange={setSelectedFolderId}
                        onCreateFolder={() => setShowCreateFolder(true)}
                    />
                    <div className="status-online hidden sm:inline-flex">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="hidden md:inline">Intelligence Layer Active</span>
                        <span className="md:hidden">Active</span>
                    </div>
                    <Link
                        href="/"
                        className="app-header-home flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600 sm:min-w-0 sm:px-2"
                        aria-label="Home"
                    >
                        <Home className="h-4 w-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                </>
            }
        >
            <div className="space-y-10">
                <section className="app-executive-panel reveal-on-scroll rounded-2xl p-6 lg:p-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                Executive intelligence overview
                            </p>
                            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                                Platform operating metrics
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Live-scale signals across competitor monitoring, alternative data fusion, and strategic
                                reporting—mission-critical infrastructure for enterprise trade teams.
                            </p>
                        </div>
                        <div className="app-enterprise-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
                            <Shield className="h-3.5 w-3.5" />
                            Enterprise intelligence online
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {executiveIntelligenceMetrics.map((metric, index) => (
                            <MetricCard
                                key={metric.label}
                                label={metric.label}
                                value={metric.value}
                                detail={metric.detail}
                                icon={metric.icon}
                                tone={metric.tone}
                                revealIndex={index}
                            />
                        ))}
                    </div>
                </section>

                {hasWorkspaceActivity && (
                    <section className="app-workspace-strip reveal-on-scroll rounded-xl px-5 py-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Workspace activity</p>
                        <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-700">
                            <span>
                                <strong className="font-semibold text-slate-900">{folderStats!.dataset_count}</strong>{' '}
                                datasets in folder
                            </span>
                            <span>
                                <strong className="font-semibold text-slate-900">{folderStats!.report_count}</strong>{' '}
                                reports
                            </span>
                            <span>
                                <strong className="font-semibold text-slate-900">{folderStats!.b2b_search_count}</strong>{' '}
                                intelligence searches
                            </span>
                        </div>
                    </section>
                )}

                <section className="app-strategic-suite reveal-on-scroll rounded-2xl p-6 lg:p-8">
                    <div className="mb-6">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2451c4]">
                            Primary intelligence layer
                        </p>
                        <h2 className="section-title mt-1">Strategic Intelligence Suite</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                            Competitor intelligence, alternative data fusion, tariff optimization, market expansion, and
                            sector monitoring—consulting-grade modules for revenue growth and competitive advantage.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <ActionCard
                            icon={<Building2 className="h-7 w-7" />}
                            title="Competitor Intelligence"
                            description="Live threat scoring, buyer displacement, and alert feeds for strategic response."
                            href="/dashboard/competitors"
                            tone="green"
                            delayedEnterpriseModal
                            ctaLabel="Open intelligence"
                            featured
                        />
                        <ActionCard
                            icon={<Building2 className="h-7 w-7" />}
                            title="Company Deep Dive"
                            description="Strategic profiles with finance, portfolio, and competitive positioning layers."
                            href="/dashboard/competitors/aarti-industries"
                            tone="indigo"
                            delayedEnterpriseModal
                            ctaLabel="Open intelligence"
                            featured
                        />
                        <ActionCard
                            icon={<Scale className="h-7 w-7" />}
                            title="Tariff Optimizer"
                            description="HS classification, FTA routing, and landed-cost intelligence for duty savings."
                            href="/dashboard/tariff-optimizer"
                            tone="purple"
                            delayedEnterpriseModal
                            ctaLabel="Open intelligence"
                            featured
                        />
                        <ActionCard
                            icon={<Compass className="h-7 w-7" />}
                            title="Market Entry Simulator"
                            description="Attractiveness scoring, buyer mapping, and launch timelines for new markets."
                            href="/dashboard/market-entry"
                            tone="pink"
                            delayedEnterpriseModal
                            ctaLabel="Open intelligence"
                            featured
                        />
                        <ActionCard
                            icon={<LayoutDashboard className="h-7 w-7" />}
                            title="Sector Intelligence"
                            description="Industry networks for chemicals, agri, textiles, metals, and strategic sectors."
                            href="/dashboard/sector-intelligence"
                            tone="orange"
                            delayedEnterpriseModal
                            ctaLabel="Open intelligence"
                            featured
                        />
                        <ActionCard
                            icon={<Satellite className="h-7 w-7" />}
                            title="Alternative Data Intelligence"
                            description="Satellite, AIS, and orbital signals reconstructing hidden trade and logistics flows."
                            href="/dashboard/satellite"
                            tone="blue"
                            delayedEnterpriseModal
                            ctaLabel="Open intelligence"
                            featured
                        />
                    </div>
                </section>

                <section className="app-data-ops-section reveal-on-scroll">
                    <div className="mb-6">
                        <p className="app-section-eyebrow text-xs font-bold uppercase">Supporting capabilities</p>
                        <h2 className="section-title mt-1">Data Operations & Analysis</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            Proprietary data processing, financial reconstruction, and reporting—available beneath the
                            strategic intelligence layer.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <ActionCard
                            icon={<Zap className="h-7 w-7" />}
                            title="Data Cleaning"
                            description="AI-powered and manual trade data preparation for signal-ready intelligence."
                            href={`/dashboard/processing${selectedFolderId ? `?projectId=${selectedFolderId}` : ''}`}
                            tone="blue"
                        />
                        <ActionCard
                            icon={<BarChart3 className="h-7 w-7" />}
                            title="Analytics"
                            description="Financial trade insights, EXIM summaries, and board-ready quantitative outputs."
                            href={`/dashboard/analytics${selectedFolderId ? `?projectId=${selectedFolderId}` : ''}`}
                            tone="purple"
                        />
                        <ActionCard
                            icon={<Globe2 className="h-7 w-7" />}
                            title="B2B Intelligence"
                            description="Corporate research and competitive account intelligence workflows."
                            href="/dashboard/market"
                            tone="green"
                        />
                        <ActionCard
                            icon={<Network className="h-7 w-7" />}
                            title="Value Chain"
                            description="Interactive value-chain mapping for supply and demand intelligence."
                            href="/dashboard/value-chain"
                            tone="orange"
                        />
                        <ActionCard
                            icon={<Calculator className="h-7 w-7" />}
                            title="Market Estimation"
                            description="Demand modeling and market sizing for expansion and capacity decisions."
                            href="/dashboard/market"
                            tone="pink"
                        />
                        <ActionCard
                            icon={<FileText className="h-7 w-7" />}
                            title="Reports"
                            description="Generate consulting-grade PDF intelligence reports with strategic insights."
                            href="/dashboard/reports"
                            tone="indigo"
                        />
                    </div>
                </section>
            </div>

            <UploadWithFolderModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSuccess={handleUploadSuccess}
            />
            <CreateFolderModal
                isOpen={showCreateFolder}
                onClose={() => setShowCreateFolder(false)}
                onSuccess={setSelectedFolderId}
            />
        </AppShell>
    )
}

function ActionCard({
    icon,
    title,
    description,
    href,
    tone,
    delayedEnterpriseModal = false,
    ctaLabel = 'Access module',
    featured = false,
}: {
    icon: React.ReactNode
    title: string
    description: string
    href: string
    tone: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'
    delayedEnterpriseModal?: boolean
    ctaLabel?: string
    featured?: boolean
}) {
    const tones = {
        blue: 'icon-box-blue',
        green: 'icon-box-green',
        purple: 'icon-box-purple',
        orange: 'icon-box-orange',
        pink: 'icon-box-pink',
        indigo: 'icon-box-indigo',
    }

    return (
        <Link
            href={href}
            className="group block h-full"
            data-delayed-enterprise-modal={delayedEnterpriseModal ? 'true' : undefined}
            data-feature={delayedEnterpriseModal ? title : undefined}
        >
            <div
                className={`surface-card app-action-card flex h-full flex-col ${
                    featured ? 'app-action-card--featured' : ''
                }`}
            >
                <div className={`mb-4 ${tones[tone]}`}>{icon}</div>
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-slate-900 group-hover:text-blue-600">
                    {title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-6 text-slate-600">{description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                    {ctaLabel}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}

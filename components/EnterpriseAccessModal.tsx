'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const PENDING_FEATURE_KEY = 'kautilya_pending_feature_modal'
const DISMISSED_KEY = 'kautilya_modal_dismissed'

type PendingFeature = {
    featureName: string
    createdAt: number
    locked?: boolean
}

export function EnterpriseAccessModalProvider() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [activeFeature, setActiveFeature] = useState<string | null>(null)
    const [locked, setLocked] = useState(false)

    const openModal = (featureName?: string | null, shouldLock = false) => {
        setActiveFeature(featureName || null)
        setLocked(shouldLock)
        setOpen(true)
    }

    const closeModal = () => {
        if (locked) return
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000
        window.localStorage.setItem(DISMISSED_KEY, String(expiresAt))
        setOpen(false)
        setActiveFeature(null)
        setLocked(false)
    }

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null
            const delayedTrigger = target?.closest('[data-delayed-enterprise-modal]')
            const instantTrigger = target?.closest('[data-modal-trigger="early-access"], [data-modal-trigger="feature"]')

            if (delayedTrigger) {
                const featureName =
                    delayedTrigger.getAttribute('data-feature') ||
                    delayedTrigger.getAttribute('data-modal-feature') ||
                    delayedTrigger.textContent?.trim() ||
                    'Selected feature'

                window.sessionStorage.setItem(
                    PENDING_FEATURE_KEY,
                    JSON.stringify({ featureName, createdAt: Date.now(), locked: true } satisfies PendingFeature),
                )
                return
            }

            if (instantTrigger) {
                event.preventDefault()
                openModal(
                    instantTrigger.getAttribute('data-feature') ||
                        instantTrigger.getAttribute('data-modal-feature'),
                )
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    useEffect(() => {
        const pendingRaw = window.sessionStorage.getItem(PENDING_FEATURE_KEY)
        if (!pendingRaw) return

        let pending: PendingFeature | null = null
        try {
            pending = JSON.parse(pendingRaw) as PendingFeature
        } catch {
            window.sessionStorage.removeItem(PENDING_FEATURE_KEY)
            return
        }

        if (!pending?.featureName || Date.now() - pending.createdAt > 60_000) {
            window.sessionStorage.removeItem(PENDING_FEATURE_KEY)
            return
        }

        const timeout = window.setTimeout(() => {
            openModal(pending?.featureName, Boolean(pending?.locked))
            window.sessionStorage.removeItem(PENDING_FEATURE_KEY)
        }, 2000)

        return () => window.clearTimeout(timeout)
    }, [pathname])

    return <EnterpriseModal open={open} featureName={activeFeature} locked={locked} onClose={closeModal} />
}

function EnterpriseModal({
    open,
    featureName,
    locked,
    onClose,
}: {
    open: boolean
    featureName: string | null
    locked: boolean
    onClose: () => void
}) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)')
        const update = () => setIsMobile(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [open])

    if (!open) return null

    return (
        <div
            className="enterprise-modal-overlay fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto px-4 py-8 sm:items-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: isMobile ? 'none' : 'blur(4px)' }}
            onMouseDown={(event) => {
                if (!locked && event.target === event.currentTarget) onClose()
            }}
        >
            <div
                className={`enterprise-modal-panel relative w-[95%] max-h-[85vh] overflow-y-auto rounded-[20px] bg-white px-5 py-7 text-left shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:max-h-none sm:p-10 ${
                    locked ? 'max-w-[520px]' : 'max-w-[700px]'
                } ${isMobile ? 'enterprise-modal-panel--mobile' : 'animate-[enterpriseModalIn_220ms_ease-out]'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="enterprise-modal-title"
                style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}
            >
                {!locked && (
                    <button
                        type="button"
                        className="enterprise-modal-close absolute right-4 top-4 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#94a3b8] transition hover:bg-[#f8f9ff] hover:text-[#0f1423] sm:right-6 sm:top-6"
                        aria-label="Close dialog"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                <div className="mb-4 inline-flex rounded-full bg-[#EEF2FF] px-3 py-1.5 text-[11px] font-bold uppercase text-[#2451c4]">
                    Building the Future of Trade Intelligence
                </div>

                {featureName && (
                    <div className="mb-4 rounded-lg bg-[#EEF2FF] px-[14px] py-2 text-[13px] italic text-[#2451c4]">
                        &quot;{featureName}&quot; is currently available to select early partners.
                    </div>
                )}

                {locked ? (
                    <>
                        <h2
                            id="enterprise-modal-title"
                            className="pr-10 text-[20px] font-extrabold leading-tight text-[#0f1423] sm:text-[24px]"
                        >
                            This premium intelligence module is available to select early partners.
                        </h2>
                        <p className="mt-4 text-[13px] leading-[1.7] text-[#718096] sm:text-sm">
                            KautilyaAI is onboarding strategic users, investors, and technical partners building the next
                            generation of trade intelligence.
                        </p>
                    </>
                ) : (
                    <>
                        <h2
                            id="enterprise-modal-title"
                            className="pr-10 text-[20px] font-extrabold leading-tight text-[#0f1423] sm:text-[26px]"
                        >
                            KautilyaAI is currently seeking strategic investors and a technical co-founder.
                        </h2>

                        <div className="mt-4 space-y-1 text-[13px] leading-[1.7] text-[#718096] sm:text-sm">
                            <p>India&apos;s first post-customs-data-ban trade intelligence platform.</p>
                            <p>
                                Think Bloomberg Terminal for trade, Palantir for supply chains, McKinsey-grade strategy
                                powered by AI.
                            </p>
                            <p>Currently onboarding a limited group of early users while expanding the platform.</p>
                        </div>

                        <div className="my-6 h-px bg-[#e8eaf0]" />

                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#a0aec0]">
                            Who We&apos;re Looking For
                        </p>
                        <div className="enterprise-modal-cards grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-3">
                            <ModalInfoCard
                                title="Strategic Investors"
                                body="Speaking with angel investors, trade-tech investors, logistics operators, and industry insiders who understand alternative-data intelligence."
                            />
                            <ModalInfoCard
                                title="Technical Co-Founder"
                                body="Looking for a world-class engineer passionate about AI, data infrastructure, intelligence systems, and category-defining software."
                            />
                            <ModalInfoCard
                                title="Design Partners"
                                body="Manufacturers, exporters, importers across chemicals, pharma, agri, and industrial sectors ready to shape the platform."
                            />
                        </div>

                        <div className="my-6 h-px bg-[#e8eaf0]" />

                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#a0aec0]">
                            Why This Matters
                        </p>
                        <p className="text-[13px] leading-[1.75] text-[#4a5568] sm:text-sm">
                            India&apos;s customs data restrictions fundamentally changed trade intelligence. Most platforms lost
                            visibility. KautilyaAI was built specifically for this new reality - using AIS vessel tracking,
                            multi-country bill of lading networks, regulatory filings, financial disclosures, and AI-powered
                            analysis. This is a unique opportunity to build the next generation of trade intelligence infrastructure.
                        </p>
                    </>
                )}

                <div className={`${locked ? 'mt-6' : 'mt-7'} enterprise-modal-actions flex flex-col gap-3 sm:flex-row`}>
                    <a
                        href="mailto:hello@kautilyaai.com?subject=KautilyaAI%20Strategic%20Conversation"
                        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[10px] bg-gradient-to-r from-[#3a6be4] to-[#2451c4] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95 sm:w-auto"
                    >
                        Schedule a Conversation
                    </a>
                    <a
                        href="mailto:hello@kautilyaai.com?subject=KautilyaAI%20Early%20Access"
                        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[10px] border-[1.5px] border-[#c7d6fa] bg-white px-6 py-3 text-sm font-bold text-[#2451c4] transition hover:bg-[#f8f9ff] sm:w-auto"
                    >
                        Join Early Access
                    </a>
                </div>

                {!locked && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="mx-auto mt-5 flex min-h-[44px] items-center text-[13px] font-medium text-[#a0aec0] underline-offset-4 hover:underline"
                    >
                        Continue Exploring Platform
                    </button>
                )}

                {locked && (
                    <a
                        href="/"
                        className="mx-auto mt-5 inline-flex min-h-[44px] items-center justify-center rounded-[10px] border border-[#e8eaf0] bg-white px-5 py-2.5 text-[13px] font-bold text-[#2451c4] transition hover:bg-[#f8f9ff]"
                    >
                        Back to Homepage
                    </a>
                )}
            </div>
        </div>
    )
}

function ModalInfoCard({ title, body }: { title: string; body: string }) {
    return (
        <div className="rounded-[14px] border border-[#e8eaf0] bg-[#f8f9ff] p-5">
            <h3 className="text-sm font-extrabold text-[#0f1423]">{title}</h3>
            <p className="mt-2 text-[13px] leading-[1.65] text-[#4a5568]">{body}</p>
        </div>
    )
}

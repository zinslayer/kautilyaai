"use client"

import Link from 'next/link'
import { ArrowRight, Upload, Zap, Database } from 'lucide-react'
import { AppShell } from '@/components/premium/Studio'

export default function MarketPage() {
    return (
        <AppShell
            title="B2B Intelligence & Market Estimation"
            subtitle="Research companies and analyze market opportunities"
            showNav
            actions={
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600">
                    ← Back to Dashboard
                </Link>
            }
        >
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="max-w-md text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-4">
                            <Database className="h-12 w-12 text-green-600" />
                        </div>
                    </div>

                    <h2 className="mb-3 text-2xl font-bold text-slate-900">No Data Yet</h2>
                    <p className="mb-8 text-slate-600">
                        Upload your trade data or link to our market database to unlock B2B intelligence and market estimation insights.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/dashboard/processing"
                            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-medium text-white transition hover:shadow-lg hover:shadow-green-500/50"
                        >
                            <Upload className="h-5 w-5" />
                            Upload Your Data
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </Link>

                        <button
                            onClick={() => alert('Link to market database coming soon!')}
                            className="w-full rounded-lg border-2 border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            Link from Our Market Database
                        </button>
                    </div>

                    <div className="mt-8 space-y-2 text-left text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Get competitive intelligence reports</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Calculate market size and demand forecasts</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Research companies with AI-powered insights</span>
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    )
}

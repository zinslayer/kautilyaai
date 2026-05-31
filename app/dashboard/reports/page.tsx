"use client"

import Link from 'next/link'
import { ArrowRight, Upload, Zap, FileText } from 'lucide-react'
import { AppShell } from '@/components/premium/Studio'

export default function ReportsPage() {
    return (
        <AppShell
            title="Reports"
            subtitle="Generate and download PDF reports with insights"
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
                        <div className="rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
                            <FileText className="h-12 w-12 text-indigo-600" />
                        </div>
                    </div>

                    <h2 className="mb-3 text-2xl font-bold text-slate-900">No Reports Yet</h2>
                    <p className="mb-8 text-slate-600">
                        Upload your data to generate professional PDF reports with charts, analysis, and strategic insights.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/dashboard/processing"
                            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 font-medium text-white transition hover:shadow-lg hover:shadow-indigo-500/50"
                        >
                            <Upload className="h-5 w-5" />
                            Upload Your Data
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </Link>

                        <button
                            onClick={() => alert('Sample reports coming soon!')}
                            className="w-full rounded-lg border-2 border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            View Sample Reports
                        </button>
                    </div>

                    <div className="mt-8 space-y-2 text-left text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Professional PDF exports with branding</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Interactive charts and data visualizations</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Strategic insights and recommendations</span>
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    )
}

"use client"

import Link from 'next/link'
import { ArrowRight, Upload, Zap, Network } from 'lucide-react'
import { AppShell } from '@/components/premium/Studio'

export default function ValueChainPage() {
    return (
        <AppShell
            title="Value Chain"
            subtitle="Build and visualize product value chains"
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
                        <div className="rounded-full bg-gradient-to-br from-orange-100 to-amber-100 p-4">
                            <Network className="h-12 w-12 text-orange-600" />
                        </div>
                    </div>

                    <h2 className="mb-3 text-2xl font-bold text-slate-900">No Value Chains Yet</h2>
                    <p className="mb-8 text-slate-600">
                        Upload your product data to build interactive value chain diagrams and visualize supply chain relationships.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/dashboard/processing"
                            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-medium text-white transition hover:shadow-lg hover:shadow-orange-500/50"
                        >
                            <Upload className="h-5 w-5" />
                            Upload Your Data
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </Link>

                        <button
                            onClick={() => alert('Template builder coming soon!')}
                            className="w-full rounded-lg border-2 border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            Use a Template
                        </button>
                    </div>

                    <div className="mt-8 space-y-2 text-left text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Interactive React Flow diagrams</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Custom node and edge configuration</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Export diagrams as images or data</span>
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    )
}

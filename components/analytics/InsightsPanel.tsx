
import React from 'react';
import { Lightbulb, Info, AlertTriangle, Zap, BarChart2 } from 'lucide-react';

interface InsightsPanelProps {
    intelligence: {
        hhi: number;
        insights: string[];
        avg_price?: number;
        total_volume?: number;
        competitor_count?: number;
        customer_count?: number;
    }
}

export function InsightsPanel({ intelligence }: InsightsPanelProps) {
    if (!intelligence) return null;

    const { hhi, insights } = intelligence;

    // HHI interpretation
    const getHHIStatus = (score: number) => {
        if (score < 1500) return { label: 'Fragmented', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Highly competitive market with many small players.' };
        if (score < 2500) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', desc: 'Moderately concentrated market.' };
        return { label: 'Consolidated', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', desc: 'Highly concentrated market dominated by few large players.' };
    };

    const hhiStatus = getHHIStatus(hhi);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Market Concentration Card */}
            <div className={`p-6 rounded-xl border ${hhiStatus.border} ${hhiStatus.bg} flex flex-col justify-between shadow-sm`}>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart2 className={`h-5 w-5 ${hhiStatus.color}`} />
                        <h3 className={`font-bold text-sm uppercase tracking-wider ${hhiStatus.color}`}>Market Concentration</h3>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl font-black text-slate-900">{Math.round(hhi)}</span>
                        <span className="text-xs font-bold text-slate-400">HHI INDEX</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hhiStatus.bg} ${hhiStatus.color} border ${hhiStatus.border}`}>
                            {hhiStatus.label}
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {hhiStatus.desc}
                    </p>
                </div>
            </div>

            {/* Strategic Insights Panel */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Strategic Observations</h3>
                </div>

                <div className="space-y-3">
                    {insights && insights.length > 0 ? (
                        insights.map((insight, i) => (
                            <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-slate-50 border border-slate-100 transition-hover hover:border-blue-100">
                                <div className="mt-1">
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                </div>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                    {insight}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6">
                            <Info className="h-8 w-8 text-slate-200 mb-2" />
                            <p className="text-xs text-slate-400 font-medium">No significant anomalies or risks detected in this period.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

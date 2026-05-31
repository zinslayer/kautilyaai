import React, { useMemo } from 'react';
import {
    Zap,
    Target,
    TrendingUp,
    FlaskConical,
    Anchor,
    Users,
    BarChart3,
    ChevronRight,
    ArrowUpRight,
    Ship
} from 'lucide-react';

interface CompanyProfile {
    company_name: string;
    total_volume_mt: number;
    avg_price_usd_per_kg: number;
    market_share_percent: number;
    trend: string;
    growth_rate_percent: number;
}

interface EXIMIntelligenceProps {
    intelligence: {
        avg_price: number;
        total_volume: number;
        top_competitors: CompanyProfile[];
        top_customers: any[];
    }
}

export function EXIMIntelligence({ intelligence }: EXIMIntelligenceProps) {
    if (!intelligence || !intelligence.top_competitors) return null;

    const { avg_price, total_volume, top_competitors } = intelligence;

    const strategicCategories = useMemo(() => {
        const volumeDrivers = top_competitors.filter(c => c.market_share_percent > 15 || top_competitors.indexOf(c) < 3);

        const priceAnchors = top_competitors.filter(c =>
            Math.abs(c.avg_price_usd_per_kg - avg_price) / (avg_price || 1) < 0.15
        ).slice(0, 5);

        const scaleUpCandidates = top_competitors.filter(c =>
            c.market_share_percent < 5 &&
            (c.trend === 'growing' || c.growth_rate_percent > 25)
        ).slice(0, 5);

        const rdNiche = top_competitors.filter(c =>
            c.market_share_percent < 2 &&
            c.avg_price_usd_per_kg > avg_price * 1.5
        ).slice(0, 5);

        return [
            {
                id: 'volume',
                title: 'Volume Drivers',
                description: 'Dominant entities controlling market supply and scale.',
                icon: Ship,
                color: 'blue',
                companies: volumeDrivers,
                metricLabel: 'Market Share'
            },
            {
                id: 'anchor',
                title: 'Price Anchors',
                description: 'Entities trading closest to the market weighted average price.',
                icon: Anchor,
                color: 'indigo',
                companies: priceAnchors,
                metricLabel: 'Avg Price'
            },
            {
                id: 'scaleup',
                title: 'Scale-Up Candidates',
                description: 'Small-volume players showing aggressive growth velocity.',
                icon: TrendingUp,
                color: 'emerald',
                companies: scaleUpCandidates,
                metricLabel: 'Growth'
            },
            {
                id: 'rd',
                title: 'Niche / R&D Players',
                description: 'Low-volume, high-value entities likely in testing or R&D phase.',
                icon: FlaskConical,
                color: 'purple',
                companies: rdNiche,
                metricLabel: 'Unit Value'
            }
        ];
    }, [top_competitors, avg_price, total_volume]);

    return (
        <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg shadow-lg">
                        <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Trade Strategy & Lifecycle Classification</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intelligent partner categorization based on volume and pricing behavior</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {strategicCategories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:border-slate-300 hover:shadow-md group">
                        <div className={`p-4 bg-${cat.color}-50 border-b border-${cat.color}-100 flex items-center justify-between`}>
                            <div className="flex items-center gap-2">
                                <cat.icon className={`h-4 w-4 text-${cat.color}-600`} />
                                <h4 className={`text-xs font-black uppercase tracking-wider text-${cat.color}-700`}>{cat.title}</h4>
                            </div>
                            <span className="text-[10px] font-black text-slate-400">{cat.companies.length} Entities</span>
                        </div>

                        <div className="p-4 flex-1">
                            <p className="text-[11px] text-slate-500 font-bold mb-4 leading-relaxed line-clamp-2">
                                {cat.description}
                            </p>

                            <div className="space-y-3">
                                {cat.companies.length > 0 ? cat.companies.map((comp, i) => (
                                    <div key={i} className="flex items-center justify-between group/item">
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-[11px] font-black text-slate-700 uppercase truncate group-hover/item:text-blue-600 transition-colors">
                                                {comp.company_name}
                                            </span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    {Math.round(comp.total_volume_mt).toLocaleString()} MT
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[10px] font-black text-${cat.color}-600`}>
                                                {cat.metricLabel === 'Market Share' ? `${comp.market_share_percent}%` :
                                                    cat.metricLabel === 'Avg Price' ? `$${comp.avg_price_usd_per_kg.toFixed(2)}` :
                                                        cat.metricLabel === 'Growth' ? `${comp.growth_rate_percent.toFixed(0)}%` :
                                                            `$${comp.avg_price_usd_per_kg.toFixed(0)}`}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-400 tracking-tighter uppercase">
                                                {cat.metricLabel}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No candidates identified</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {cat.companies.length > 0 && (
                            <button className="w-full p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 group-hover:bg-slate-100 transition-colors">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Explore Full Profile</span>
                                <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight italic">Strategic Supply Outlook</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Identified {top_competitors.filter(c => c.trend === 'growing').length} providers with expansion trajectory</p>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Stability</p>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-2xl font-black text-white">92%</span>
                                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                            </div>
                        </div>
                        <div className="text-right border-l border-slate-800 pl-8">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pricing Integrity</p>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-2xl font-black text-white">High</span>
                                <div className="p-1 bg-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

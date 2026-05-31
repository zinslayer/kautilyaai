
import { Database, TrendingUp, Calendar, FileText, BarChart3 } from 'lucide-react'

interface KeyMetricsProps {
    data: {
        total_volume_mt: number
        weighted_avg_price: number
        total_quarters: number
        unique_products: number
        hhi?: number
    }
}

export function KeyMetrics({ data }: KeyMetricsProps) {
    if (!data) return null;

    interface Metric {
        label: string;
        value: string;
        subtext?: string;
        icon: any;
        color: string;
    }

    const metrics: Metric[] = [
        {
            label: 'TOTAL VOLUME',
            value: `${data.total_volume_mt?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'} MT`,
            icon: Database,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            label: 'WEIGHTED AVG PRICE',
            value: `$${data.weighted_avg_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}/kg`,
            icon: TrendingUp,
            color: 'text-green-600 bg-green-50'
        },
        {
            label: 'TIME PERIODS',
            value: `${data.total_quarters ?? 0} Quarters`,
            icon: Calendar,
            color: 'text-purple-600 bg-purple-50'
        },
        {
            label: 'UNIQUE PRODUCTS',
            value: data.unique_products?.toLocaleString() ?? 0,
            icon: FileText,
            color: 'text-orange-600 bg-orange-50'
        }
    ];

    // Add HHI if present
    if (data.hhi !== undefined) {
        metrics.push({
            label: 'MARKET CONCENTRATION',
            value: Math.round(data.hhi).toLocaleString(),
            subtext: 'HHI INDEX',
            icon: BarChart3,
            color: 'text-rose-600 bg-rose-50'
        });
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {metrics.map((metric, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-200 hover:shadow-md group">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{metric.label}</p>
                        <div className={`p-2 rounded-lg ${metric.color} transition-transform group-hover:scale-110`}>
                            <metric.icon className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">
                            {metric.value}
                        </h3>
                        {metric.subtext && (
                            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">
                                {metric.subtext}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

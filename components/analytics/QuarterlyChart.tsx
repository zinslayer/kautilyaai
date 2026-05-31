
import {
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface QuarterlyChartProps {
    data: any[]
}

export function QuarterlyChart({ data }: QuarterlyChartProps) {
    console.debug('[QuarterlyChart] render, dataLength=', data?.length ?? 0)
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex items-center justify-center">
                <div className="animate-pulse w-full">
                    <div className="h-6 bg-slate-200 rounded mb-4" />
                    <div className="h-60 bg-slate-100 rounded" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                Quarterly Volume & Price Analysis
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="Quarter"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Volume (MT)', angle: -90, position: 'insideLeft', fill: '#f97316' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Price ($/kg)', angle: 90, position: 'insideRight', fill: '#22c55e' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="volume_mt" name="Volume (MT)" fill="#f97316" barSize={40} radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="price_per_kg" name="Weighted Avg Price ($/kg)" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

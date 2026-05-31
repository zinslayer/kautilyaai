import { useState, useEffect, useMemo } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    MarkerType,
    Position,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    Truck,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    TrendingUp,
    ShieldCheck,
    AlertTriangle,
    Activity,
    Zap,
    Users,
    ChevronRight,
    PieChart
} from 'lucide-react'

interface SupplyChainProps {
    data: { [key: string]: any[] }
}

const EDGE_COLORS = [
    '#6366F1', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F97316', // Orange
];

export function SupplyChain({ data }: SupplyChainProps) {
    const [selectedFY, setSelectedFY] = useState<string>("All Time");
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        console.debug('[SupplyChain] mount, selectedFY=', selectedFY)
        return () => console.debug('[SupplyChain] unmount')
    }, [])

    if (!data) return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[650px] flex items-center justify-center">
            <div className="text-slate-400">No supply chain data</div>
        </div>
    )

    const availableFYs = Object.keys(data).sort((a, b) => {
        if (a === "All Time") return -1;
        if (b === "All Time") return 1;
        return b.localeCompare(a);
    });

    const currentData = data[selectedFY] || [];

    // Calculate Strategic Metrics & Entity Profiles
    const { entityProfiles, strategicMetrics } = useMemo(() => {
        const filteredData = currentData.filter(flow => flow.value >= 0.1);
        const totalVolume = filteredData.reduce((acc, flow) => acc + flow.value, 0);
        const profiles: Record<string, any> = {};

        // Previous Year for Trend Calculation
        const fyIndex = availableFYs.indexOf(selectedFY);
        const prevFY = (selectedFY !== "All Time" && fyIndex < availableFYs.length - 1)
            ? availableFYs[fyIndex + 1]
            : null;
        const prevData = prevFY ? data[prevFY].filter(flow => flow.value >= 0.1) : [];

        filteredData.forEach(flow => {
            if (!profiles[flow.source]) {
                profiles[flow.source] = { name: flow.source, role: 'Supplier', volume: 0, partners: new Set(), prevVolume: 0 };
            }
            profiles[flow.source].volume += flow.value;
            profiles[flow.source].partners.add(flow.target);

            if (!profiles[flow.target]) {
                profiles[flow.target] = { name: flow.target, role: 'Importer', volume: 0, partners: new Set(), prevVolume: 0 };
            }
            profiles[flow.target].volume += flow.value;
            profiles[flow.target].partners.add(flow.source);
        });

        prevData.forEach(flow => {
            if (profiles[flow.source]) profiles[flow.source].prevVolume += flow.value;
            if (profiles[flow.target]) profiles[flow.target].prevVolume += flow.value;
        });

        const profileList = Object.values(profiles).map(p => {
            const share = (p.volume / (totalVolume || 1)) * 100;
            let trend = 'Stable';
            if (p.prevVolume > 0) {
                const growth = ((p.volume - p.prevVolume) / p.prevVolume) * 100;
                if (growth > 5) trend = 'Expanding';
                else if (growth < -5) trend = 'Declining';
            } else if (prevFY) {
                trend = 'New Entry';
            }

            const partnerCount = p.partners.size;
            const isHub = partnerCount >= 3;
            const isVulnerable = partnerCount === 1;

            return {
                ...p,
                share: share.toFixed(1),
                trend,
                partnerCount,
                isHub,
                isVulnerable,
                riskLevel: isVulnerable ? 'High' : (share > 20 ? 'Medium' : 'Low'),
                partners: Array.from(p.partners).slice(0, 3).join(', ')
            };
        }).sort((a, b) => b.volume - a.volume);

        // Calculate Strategic KPIs
        const top3Share = profileList.slice(0, 3).reduce((acc, p) => acc + parseFloat(p.share), 0);
        const avgConnections = profileList.reduce((acc, p) => acc + p.partnerCount, 0) / (profileList.length || 1);
        const resilienceIndex = Math.min(100, Math.round((avgConnections / 2.5) * 100)); // Scaled resilience score

        return {
            entityProfiles: profileList,
            strategicMetrics: {
                totalVolume: totalVolume.toLocaleString(),
                activePartners: profileList.length,
                resilienceIndex,
                concentrationRisk: top3Share.toFixed(1),
                vulnerabilities: profileList.filter(p => p.isVulnerable).length,
                hubs: profileList.filter(p => p.isHub).length
            }
        };
    }, [currentData, selectedFY, availableFYs, data]);

    useEffect(() => {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        const nodeSet = new Set<string>();
        const filteredData = currentData.filter(flow => flow.value >= 0.1);

        const sourceVolumes: Record<string, number> = {};
        const targetVolumes: Record<string, number> = {};
        filteredData.forEach(flow => {
            sourceVolumes[flow.source] = (sourceVolumes[flow.source] || 0) + flow.value;
            targetVolumes[flow.target] = (targetVolumes[flow.target] || 0) + flow.value;
        });

        const sortedSources = Object.entries(sourceVolumes).sort((a, b) => b[1] - a[1]).map(([name]) => name);
        const sortedTargets = Object.entries(targetVolumes).sort((a, b) => b[1] - a[1]).map(([name]) => name);

        const MAX_PER_COL = 8;
        const COL_WIDTH = 450;
        const V_STEP = 125; // Slightly more air
        const TIER_GAP = 600;
        const TOP_MARGIN = 80;

        const sourceColorMap: Record<string, string> = {};
        sortedSources.forEach((source, i) => {
            sourceColorMap[source] = EDGE_COLORS[i % EDGE_COLORS.length];
        });

        sortedSources.forEach((source, index) => {
            const colIndex = Math.floor(index / MAX_PER_COL);
            const rowIndex = index % MAX_PER_COL;
            const sourceId = `source-${source}`;
            newNodes.push({
                id: sourceId,
                data: { label: source },
                position: { x: colIndex * COL_WIDTH, y: TOP_MARGIN + rowIndex * V_STEP },
                style: {
                    background: '#FFFFFF',
                    color: sourceColorMap[source],
                    border: `2px solid ${sourceColorMap[source]}`,
                    borderRadius: '16px',
                    width: 340,
                    fontSize: '16px',
                    fontWeight: '900',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    textTransform: 'uppercase',
                    cursor: 'grab'
                },
                sourcePosition: Position.Right,
                type: 'input'
            });
            nodeSet.add(sourceId);
        });

        const supplierColCount = Math.max(1, Math.ceil(sortedSources.length / MAX_PER_COL));
        const startXTargets = (supplierColCount * COL_WIDTH) + TIER_GAP;

        sortedTargets.forEach((target, index) => {
            const colIndex = Math.floor(index / MAX_PER_COL);
            const rowIndex = index % MAX_PER_COL;
            const targetId = `target-${target}`;
            newNodes.push({
                id: targetId,
                data: { label: target },
                position: { x: startXTargets + colIndex * COL_WIDTH, y: TOP_MARGIN + rowIndex * V_STEP },
                style: {
                    background: '#FFFFFF',
                    color: '#1E293B',
                    border: '2px solid #CBD5E1',
                    borderRadius: '16px',
                    width: 340,
                    fontSize: '16px',
                    fontWeight: '900',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    textTransform: 'uppercase',
                    cursor: 'grab'
                },
                targetPosition: Position.Left,
                type: 'output'
            });
            nodeSet.add(targetId);
        });

        filteredData.forEach((flow, i) => {
            const color = sourceColorMap[flow.source];
            newEdges.push({
                id: `e-${selectedFY}-${i}`,
                source: `source-${flow.source}`,
                target: `target-${flow.target}`,
                animated: true,
                label: `${Math.round(flow.value).toLocaleString()} MT`,
                style: { stroke: color, strokeWidth: Math.max(4, Math.min(flow.value / 20, 20)), opacity: 0.75 },
                labelStyle: { fill: color, fontSize: 13, fontWeight: 900 },
                labelBgStyle: { fill: '#FFFFFF', fillOpacity: 0.95 },
                labelBgPadding: [10, 6],
                labelBgBorderRadius: 8,
                markerEnd: { type: MarkerType.ArrowClosed, color: color, width: 20, height: 20 },
            });
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, [currentData, selectedFY, setNodes, setEdges]);

    return (
        <div className="flex flex-col gap-6">
            {/* Strategic KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Resilience</p>
                        <h4 className="text-2xl font-black text-slate-900">{strategicMetrics.resilienceIndex}/100</h4>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                        <ShieldCheck className="h-6 w-6 text-blue-600 group-hover:text-white" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-amber-500 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Concentration Risk</p>
                        <h4 className="text-2xl font-black text-slate-900">{strategicMetrics.concentrationRisk}%</h4>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-600 transition-colors">
                        <PieChart className="h-6 w-6 text-amber-600 group-hover:text-white" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Hubs</p>
                        <h4 className="text-2xl font-black text-slate-900">{strategicMetrics.hubs} Entites</h4>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-600 transition-colors">
                        <Users className="h-6 w-6 text-emerald-600 group-hover:text-white" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-rose-500 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Potential Risks</p>
                        <h4 className="text-2xl font-black text-slate-900">{strategicMetrics.vulnerabilities} Alerts</h4>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl group-hover:bg-rose-600 transition-colors">
                        <AlertTriangle className="h-6 w-6 text-rose-600 group-hover:text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[650px] flex flex-col transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Activity className="h-6 w-6 text-blue-600" />
                            Supply Chain Flow Architecture
                        </h3>
                        <p className="text-xs text-slate-500 font-bold ml-8 uppercase tracking-[0.2em]">Resilience Mapping & Value-Stream Analysis</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <select
                                value={selectedFY}
                                onChange={(e) => setSelectedFY(e.target.value)}
                                className="bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0 cursor-pointer outline-none uppercase"
                            >
                                {availableFYs.map(fy => (
                                    <option key={fy} value={fy}>{fy}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 bg-slate-50/50 rounded-2xl overflow-hidden border-2 border-slate-100 relative shadow-inner">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                        fitViewOptions={{ padding: 0.15 }}
                        panOnScroll
                        zoomOnScroll={false}
                        zoomOnPinch
                        maxZoom={1.5}
                        minZoom={0.2}
                        key={selectedFY}
                    >
                        <Background color="#cbd5e1" gap={40} size={1} />
                        <Controls className="bg-white border-2 border-slate-200 fill-slate-500 shadow-xl rounded-xl" />
                    </ReactFlow>
                </div>
            </div>

            {/* Strategic Analysis & Risk Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-900 rounded-xl">
                            <Zap className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Advanced Entity Risk Matrix</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Share, Growth Trends & Network Resilience</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 border border-slate-200 px-3 py-1 rounded-full"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Supplier</span>
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 border border-slate-200 px-3 py-1 rounded-full"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Importer</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 italic">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Entity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Volume (MT)</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Share %</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Resilience</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Risk Level</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Partners (Top 3)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {entityProfiles.map((profile, i) => (
                                <tr key={i} className="hover:bg-blue-50/30 transition-colors group cursor-default">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 ${profile.role === 'Supplier' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                }`}>
                                                {profile.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700 uppercase group-hover:text-blue-700 transition-colors">{profile.name}</span>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 mt-1 rounded-md bg-slate-100 w-fit">
                                                    {profile.trend === 'Expanding' ? <ArrowUpRight className="h-2.5 w-2.5 text-emerald-600" /> :
                                                        profile.trend === 'Declining' ? <ArrowDownRight className="h-2.5 w-2.5 text-rose-600" /> :
                                                            <Minus className="h-2.5 w-2.5 text-slate-500" />}
                                                    <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">{profile.trend}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest w-fit inline-flex ${profile.role === 'Supplier' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                                            }`}>
                                            {profile.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{Math.round(profile.volume).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-black text-slate-600">{profile.share}%</span>
                                            <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-400 group-hover:bg-blue-500 transition-all" style={{ width: `${profile.share}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1">
                                                {[...Array(3)].map((_, idx) => (
                                                    <div key={idx} className={`w-3 h-1 rounded-full ${idx < profile.partnerCount ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{profile.partnerCount} Connections</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${profile.riskLevel === 'High' ? 'bg-rose-50 border-rose-200 text-rose-600 flex items-center gap-1' :
                                                profile.riskLevel === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                                    'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                }`}>
                                                {profile.riskLevel === 'High' && <AlertTriangle className="h-3 w-3" />}
                                                {profile.riskLevel} Risk
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 group/partners">
                                            <span className="text-[10px] font-bold text-slate-400 italic truncate max-w-[200px] group-hover/partners:text-slate-600 transition-colors">{profile.partners}</span>
                                            <ChevronRight className="h-3 w-3 text-slate-300 group-hover/partners:text-blue-500" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

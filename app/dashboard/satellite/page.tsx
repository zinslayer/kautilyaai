"use client"

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/premium/Studio'
import { 
    Satellite as SatIcon, 
    Ship, 
    Flame, 
    Anchor, 
    AlertTriangle, 
    Compass, 
    Radio, 
    Maximize2, 
    Zap,
    MapPin,
    Eye
} from 'lucide-react'

// Dummy Satellite Data
const portsData = [
    { name: 'Mundra Port (Terminal T2)', dwTime: '18.4 hrs', change: '-12%', status: 'optimal', density: 'High', vessels: 24 },
    { name: 'Nhava Sheva (JNPT)', dwTime: '34.2 hrs', change: '+28%', status: 'congested', density: 'Critical', vessels: 41 },
    { name: 'Rotterdam Port (ECT)', dwTime: '22.1 hrs', change: '-4%', status: 'optimal', density: 'Medium', vessels: 18 },
    { name: 'Singapore Keppel', dwTime: '14.5 hrs', change: '+2%', status: 'optimal', density: 'High', vessels: 56 },
    { name: 'Shanghai Deepwater', dwTime: '42.8 hrs', change: '+18%', status: 'warning', density: 'High', vessels: 78 }
]

const factoryActivity = [
    { name: 'Nova EV Giga-Hub', sector: 'Electronics & EV', thermal: '840°C', activity: '92%', parkingLot: '88% fill', status: 'Peak' },
    { name: 'Apex Metal smelter', sector: 'Metals & Mining', thermal: '1420°C', activity: '98%', parkingLot: '95% fill', status: 'Peak' },
    { name: 'Vortex Petrochemicals', sector: 'Chemicals & Pharma', thermal: '310°C', activity: '45%', parkingLot: '40% fill', status: 'Maintenance' },
    { name: 'Global Agri Warehousing', sector: 'Agri-Commodities', thermal: '24°C', activity: '75%', parkingLot: '70% fill', status: 'Standard' }
]

const orbitalVessels = [
    { id: 'AIS-938', name: 'MSC TOKYO', type: 'Container Carrier', cargo: 'Lithium Cell Packs', heading: 'Mundra -> Hamburg', lat: '22.84 N', lon: '69.71 E', signal: 'Strong' },
    { id: 'AIS-442', name: 'OCEAN FORCE', type: 'Ore Bulk Carrier', cargo: 'Copper Concentrate', heading: 'Valparaiso -> Nhava Sheva', lat: '18.95 N', lon: '72.82 E', signal: 'Triangulated' },
    { id: 'AIS-109', name: 'SINOPE GLORY', type: 'Chemical Tanker', cargo: 'Mononitrotoluene', heading: 'Ulsan -> Rotterdam', lat: '1.28 N', lon: '103.85 E', signal: 'Relayed' }
]

export default function SatelliteIntelPage() {
    const [selectedSector, setSelectedSector] = useState('All')
    const [isScanning, setIsScanning] = useState(true)
    const [activeRadarTarget, setActiveRadarTarget] = useState<any>(null)
    const [scanPulse, setScanPulse] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setScanPulse(prev => (prev + 1) % 360)
        }, 30)
        return () => clearInterval(interval)
    }, [])

    return (
        <AppShell
            title="Satellite & AIS"
            titleHighlight="Space Intel"
            subtitle="Orbital tracking, port dwell times, factory thermal activity, and AIS vessel intelligence."
            badge="Orbital Reconnaissance Layer"
            actions={
                <>
                    <div className="status-online">
                        <Radio className="h-3.5 w-3.5 animate-pulse" />
                        COSMOS-4 Feed Active
                    </div>
                    <button
                        onClick={() => {
                            setIsScanning(true)
                            setTimeout(() => setIsScanning(false), 2000)
                        }}
                        className="btn-primary text-xs"
                    >
                        Sync Satellite Matrix
                    </button>
                </>
            }
        >
                <div className="space-y-8">
                    
                    {/* Top Stats Cards */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <SatelliteStatCard 
                            title="Active Space Feeds"
                            value="4 Satellites"
                            desc="Planet Labs & Spire APIs online"
                            icon={<SatIcon className="h-5 w-5 text-blue-600" />}
                        />
                        <SatelliteStatCard 
                            title="Factory Activity Index"
                            value="94.2%"
                            desc="Average inferred plant load"
                            icon={<Flame className="h-5 w-5 text-red-400 animate-pulse" />}
                        />
                        <SatelliteStatCard 
                            title="Average Port Dwell Time"
                            value="26.4 Hrs"
                            desc="Normal range globally (+4.1%)"
                            icon={<Anchor className="h-5 w-5 text-indigo-400" />}
                        />
                        <SatelliteStatCard 
                            title="Triangulated Vessels"
                            value="164 Carriers"
                            desc="AIS beacons tracking in Indian Ocean"
                            icon={<Ship className="h-5 w-5 text-green-400" />}
                        />
                    </div>

                    {/* Interactive Radar and Activity Section */}
                    <div className="grid lg:grid-cols-12 gap-8">
                        
                        {/* Interactive Orbital Radar (Left 7 cols) */}
                        <div className="lg:col-span-7 surface-card border border-slate-200 bg-white rounded-2xl p-6 relative overflow-hidden shadow-2xl backdrop-blur-sm">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                            
                            <div className="relative flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Compass className="h-4 w-4 text-blue-600" />
                                        Interactive Space Tracker HUD
                                    </h3>
                                    <p className="text-xs text-slate-500">Live shipping vectors and factory nodes tracking</p>
                                </div>
                                <div className="text-[10px] text-blue-600 font-mono flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" />
                                    <span>SCAN ANGLE: {scanPulse.toFixed(0)}°</span>
                                </div>
                            </div>

                            {/* Simulated Futuristic Vector Map */}
                            <div className="relative h-96 w-full rounded-xl rounded-xl border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
                                {/* SVG Grid Lines and Radar Rings */}
                                <svg className="absolute inset-0 h-full w-full opacity-35" viewBox="0 0 500 400">
                                    {/* Concentric rings */}
                                    <circle cx="250" cy="200" r="60" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" />
                                    <circle cx="250" cy="200" r="120" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                                    <circle cx="250" cy="200" r="180" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5 5" />
                                    
                                    {/* Radar Sweeper Line */}
                                    <line 
                                        x1="250" 
                                        y1="200" 
                                        x2={250 + 180 * Math.cos((scanPulse * Math.PI) / 180)} 
                                        y2={200 + 180 * Math.sin((scanPulse * Math.PI) / 180)} 
                                        stroke="#06b6d4" 
                                        strokeWidth="1.5" 
                                        className="shadow-[0_0_12px_#06b6d4]"
                                    />
                                    
                                    {/* Grid axis lines */}
                                    <line x1="70" y1="200" x2="430" y2="200" stroke="#1e293b" strokeWidth="0.5" />
                                    <line x1="250" y1="20" x2="250" y2="380" stroke="#1e293b" strokeWidth="0.5" />
                                    
                                    {/* Indian coastline representation (glowing nodes) */}
                                    <path d="M 120,380 L 170,300 L 220,240 L 250,200 L 260,180 L 290,120 L 330,80 L 380,40" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                                </svg>

                                {/* Glowing Vessel Blips (AIS Targets) */}
                                {orbitalVessels.map((v, i) => {
                                    const positions = [
                                        { top: '35%', left: '42%' },
                                        { top: '65%', left: '72%' },
                                        { top: '25%', left: '25%' }
                                    ]
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => setActiveRadarTarget(v)}
                                            style={positions[i % positions.length]}
                                            className={`absolute flex flex-col items-center group active:scale-95 z-20 ${
                                                activeRadarTarget?.id === v.id ? 'scale-110' : ''
                                            }`}
                                        >
                                            <div className={`h-3 w-3 rounded-full flex items-center justify-center animate-pulse border shadow-[0_0_8px_currentColor] ${
                                                activeRadarTarget?.id === v.id 
                                                    ? 'bg-cyan-400 text-blue-600 border-white' 
                                                    : 'bg-indigo-500 text-indigo-400 border-indigo-700'
                                            }`} />
                                            <span className="hidden group-hover:block absolute top-4 text-[9px] rounded-lg border border-slate-200 bg-white px-1 py-0.5 rounded font-black text-slate-900 uppercase tracking-widest whitespace-nowrap shadow-md">
                                                {v.name} ({v.id})
                                            </span>
                                        </button>
                                    )
                                })}

                                {/* Active radar targeting info */}
                                {activeRadarTarget ? (
                                    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-slate-200 bg-white shadow-md rounded-xl p-4 flex justify-between items-center backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-cyan-500/10 p-2 border border-cyan-400/20 rounded-lg">
                                                <Ship className="h-5 w-5 text-blue-600 animate-pulse" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-bold text-slate-900">{activeRadarTarget.name}</span>
                                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400">{activeRadarTarget.id}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400">{activeRadarTarget.type} • Cargo: <span className="text-blue-600 font-medium">{activeRadarTarget.cargo}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-slate-900 block">{activeRadarTarget.heading}</span>
                                            <span className="text-[10px] text-slate-500 font-mono">LAT: {activeRadarTarget.lat} LON: {activeRadarTarget.lon}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute bottom-4 text-xs font-medium text-slate-500 select-none animate-pulse">
                                        Click on glowing AIS beacons to lock radar target
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Space Alerts & Port Congestion (Right 5 cols) */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            
                            {/* Space Alert Feed */}
                            <div className="surface-card border border-slate-200 bg-white rounded-2xl p-6 flex flex-col shadow-2xl backdrop-blur-sm">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                                    <Radio className="h-4 w-4 text-red-500 animate-pulse" />
                                    Dynamic Orbital Alert Feed
                                </h3>
                                <div className="space-y-4 max-h-[16rem] overflow-y-auto pr-2">
                                    <SatelliteAlert 
                                        severity="critical"
                                        title="Port Congestion Warning"
                                        desc="Nhava Sheva dwell times surged 28% from vessel stack triggers."
                                        time="10 mins ago"
                                        source="Sentinel-4 AIS"
                                    />
                                    <SatelliteAlert 
                                        severity="warning"
                                        title="Smelter Peak Capacity"
                                        desc="Apex Metal Smelter thermal footprint triggered 98% maximum output alert."
                                        time="2 hrs ago"
                                        source="Sentinel-2 Thermal"
                                    />
                                    <SatelliteAlert 
                                        severity="info"
                                        title="Vessel Loaded Successfully"
                                        desc="Vessel MSC TOKYO loaded 420MT Cargo at Hazira terminal successfully."
                                        time="3 hrs ago"
                                        source="Port AIS Network"
                                    />
                                </div>
                            </div>

                            {/* Signal Type Ratios */}
                            <div className="surface-card border border-slate-200 bg-white rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                                <h3 className="text-base font-bold text-slate-900 mb-4">Space Recon Signal Distribution</h3>
                                <div className="space-y-3">
                                    <SignalProgress label="AIS Vessel Vectors" count={86} pct={52} color="bg-cyan-500" />
                                    <SignalProgress label="Thermal Activity Signatures" count={42} pct={26} color="bg-red-500" />
                                    <SignalProgress label="Factory Parking Area Counts" count={24} pct={15} color="bg-indigo-500" />
                                    <SignalProgress label="NDVI Crop Indices" count={12} pct={7} color="bg-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sector Inferences & Factory Roof Thermals */}
                    <div className="grid md:grid-cols-2 gap-8">
                        
                        {/* Thermal and Factory Capacity */}
                        <div className="surface-card border border-slate-200 bg-white rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Flame className="h-4 w-4 text-red-500 animate-pulse" />
                                        Inferred Factory Active Loads
                                    </h3>
                                    <p className="text-xs text-slate-500">Production metrics derived from satellite thermal roofs</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {factoryActivity.map((f) => (
                                    <div key={f.name} className="flex justify-between items-center p-3.5 rounded-xl border border-slate-200 bg-slate-50 rounded-xl hover:border-slate-300 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-800">{f.name}</span>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider bg-slate-100 text-slate-600 border border-slate-200">{f.sector}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">Parking Load: <span className="text-slate-600 font-medium">{f.parkingLot}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 text-slate-800 justify-end">
                                                <span className="text-[10px] font-mono text-slate-500">{f.thermal} Roof</span>
                                                <span className="text-sm font-bold text-blue-600">{f.activity} Load</span>
                                            </div>
                                            <span className={`text-[10px] uppercase tracking-wider font-bold ${
                                                f.status === 'Peak' ? 'text-green-400' : f.status === 'Maintenance' ? 'text-orange-400 animate-pulse' : 'text-slate-400'
                                            }`}>{f.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Port Dwell-Time Metrics */}
                        <div className="surface-card border border-slate-200 bg-white rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Anchor className="h-4 w-4 text-indigo-400" />
                                        Global Port Congestion Indexes
                                    </h3>
                                    <p className="text-xs text-slate-500">Live shipping dwell durations and vessel locks</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {portsData.map((p) => (
                                    <div key={p.name} className="flex justify-between items-center p-3.5 rounded-xl border border-slate-200 bg-slate-50 rounded-xl hover:border-slate-300 transition-colors">
                                        <div>
                                            <span className="text-sm font-bold text-slate-800">{p.name}</span>
                                            <p className="text-xs text-slate-500 mt-1">Active Vessels Locked: <span className="text-slate-600 font-medium">{p.vessels}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className={`text-xs font-bold ${p.change.startsWith('+') ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>{p.change}</span>
                                                <span className="text-sm font-black text-slate-900">{p.dwTime}</span>
                                            </div>
                                            <span className={`text-[10px] uppercase font-black tracking-wider ${
                                                p.status === 'congested' ? 'text-red-400' : p.status === 'warning' ? 'text-orange-400' : 'text-green-400'
                                            }`}>{p.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
        </AppShell>
    )
}

function SatelliteStatCard({ title, value, desc, icon }: { title: string; value: string; desc: string; icon: React.ReactNode }) {
    return (
        <div className="surface-card relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">{title}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight mb-1">{value}</p>
            <p className="text-[10px] text-slate-400 leading-none">{desc}</p>
        </div>
    )
}

function SatelliteAlert({ severity, title, desc, time, source }: { severity: 'critical' | 'warning' | 'info'; title: string; desc: string; time: string; source: string }) {
    const borders = {
        critical: 'border-l-4 border-l-red-500 border-slate-200',
        warning: 'border-l-4 border-l-orange-500 border-slate-200',
        info: 'border-l-4 border-l-blue-500 border-slate-200'
    }

    return (
        <div className={`flex gap-3.5 rounded-xl border bg-white p-4 transition-all duration-300 hover:shadow-sm ${borders[severity]}`}>
            <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{title}</span>
                    <span className="text-[9px] text-slate-500 whitespace-nowrap">{time}</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal mb-2">{desc}</p>
                <div className="flex items-center gap-1.5">
                    <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700">
                        {source}
                    </span>
                </div>
            </div>
        </div>
    )
}

function SignalProgress({ label, count, pct, color }: { label: string; count: number; pct: number; color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">{label}</span>
                <span className="text-slate-500 font-mono">{count} signals ({pct}%)</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    )
}

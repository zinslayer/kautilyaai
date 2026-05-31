"use client"

import { useState, useEffect } from 'react'
import {
    BarChart3, TrendingUp, Database, Download, RefreshCw, ChevronDown,
    Search, ChevronLeft, ChevronRight, Home, Globe, Truck, FileText,
    LayoutDashboard, Table, Trash2, Plus, X, Loader2
} from 'lucide-react'
import { KeyMetrics } from '@/components/analytics/KeyMetrics'
import { QuarterlyChart } from '@/components/analytics/QuarterlyChart'
import { GeoDistribution } from '@/components/analytics/GeoDistribution'
import { InsightsPanel } from '@/components/analytics/InsightsPanel'
import { SupplyChain } from '@/components/analytics/SupplyChain'
import { EXIMIntelligence } from '@/components/analytics/EXIMIntelligence'
import FolderSelector from '@/components/FolderSelector'
import { projectApi } from '@/lib/projectApi'
import { useSearchParams } from 'next/navigation'

const API_BASE_URL = 'http://127.0.0.1:8000'

interface SavedDataset {
    id: string
    name: string
    created_at: string
    row_count: number
    data_type: string
}

export default function AnalyticsPage() {
    useEffect(() => {
        console.debug('[AnalyticsPage] mounted, selectedProjectId=', selectedProjectId)
        return () => console.debug('[AnalyticsPage] unmounted')
    }, [])
    const searchParams = useSearchParams()
    const projectIdParam = searchParams.get('projectId')

    const [datasets, setDatasets] = useState<SavedDataset[]>([])
    const [selectedDatasetId, setSelectedDatasetId] = useState<string>('')
    const [selectedProjectId, setSelectedProjectId] = useState<string>(projectIdParam || '')
    const [showCreateFolder, setShowCreateFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [isCreatingFolder, setIsCreatingFolder] = useState(false)

    const [analytics, setAnalytics] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState('overview')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        console.debug('[AnalyticsPage] activeTab=', activeTab)
    }, [activeTab])

    // Table State
    const [tableData, setTableData] = useState<any[]>([])
    const [tableColumns, setTableColumns] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [limit] = useState(50)
    const [totalRows, setTotalRows] = useState(0)
    const [search, setSearch] = useState('')
    const [isTableLoading, setIsTableLoading] = useState(false)

    // EXIM Table State (Separate Fetch)
    // NOTE: In the new premium backend, most logic is in get_analytics, 
    // but the detailed EXIM pivot table is still useful.
    // I will keep the fetch for the pivot table if needed, or rely on the new metrics.
    // The user asked for "EXIM Analysis Table" to be kept.
    const [eximData, setEximData] = useState<any>(null)

    // Fetch list of datasets when project changes
    useEffect(() => {
        if (selectedProjectId) {
            fetchDatasets(selectedProjectId)
        } else {
            setDatasets([])
            setSelectedDatasetId('')
            setAnalytics(null)
        }
    }, [selectedProjectId])

    useEffect(() => {
        if (projectIdParam && !selectedProjectId) {
            setSelectedProjectId(projectIdParam)
        }
    }, [projectIdParam])

    // Fetch analytics when dataset is selected
    useEffect(() => {
        if (selectedDatasetId) {
            fetchAnalytics(selectedDatasetId)
            fetchTableData(selectedDatasetId, 1, search)
            fetchEximData(selectedDatasetId)
        }
    }, [selectedDatasetId])

    const fetchDatasets = async (projectId: string) => {
        setIsLoading(true)
        try {
            const query = new URLSearchParams()
            if (projectId) query.append('project_id', projectId)

            const res = await fetch(`${API_BASE_URL}/api/v1/public/saved-datasets?${query}`)
            if (!res.ok) throw new Error("Failed to fetch datasets")
            const data = await res.json()
            setDatasets(data)

            // If we have datasets, select the first one if none selected or if current not in new list
            if (data.length > 0) {
                const currentStillExists = data.find((d: any) => d.id === selectedDatasetId)
                if (!selectedDatasetId || !currentStillExists) {
                    setSelectedDatasetId(data[0].id)
                }
            } else {
                setSelectedDatasetId('')
                setAnalytics(null)
            }
        } catch (err) {
            console.error(err)
            setError('Failed to load files for this folder')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteDataset = async () => {
        if (!selectedDatasetId) return

        const dataset = datasets.find(d => d.id === selectedDatasetId)
        if (!confirm(`Are you sure you want to permanently delete "${dataset?.name}"? This cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/datasets/${selectedDatasetId}`, {
                method: 'DELETE'
            })
            if (!res.ok) throw new Error("Failed to delete dataset")

            // Refresh dataset list
            await fetchDatasets(selectedProjectId)

        } catch (err: any) {
            alert(err.message || "Failed to delete")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return
        setIsCreatingFolder(true)
        try {
            const project = await projectApi.createProject({
                name: newFolderName,
                description: 'Analytics folder',
                project_type: 'product_analysis'
            })
            setSelectedProjectId(project.id)
            setShowCreateFolder(false)
            setNewFolderName('')
        } catch (err: any) {
            setError('Failed to create folder')
        } finally {
            setIsCreatingFolder(false)
        }
    }

    const fetchAnalytics = async (id: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/public/saved-dataset/${id}/analytics`)
            if (!res.ok) throw new Error("Failed to generate analytics")
            const data = await res.json()
            setAnalytics(data)
        } catch (err: any) {
            setError(err.message)
            setAnalytics(null)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchEximData = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/public/saved-dataset/${id}/exim-analytics`)
            // It might fail if endpoint doesn't exist yet or changed, but let's try
            if (res.ok) {
                const data = await res.json()
                setEximData(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const fetchTableData = async (id: string, pageNum: number, searchTerm: string) => {
        setIsTableLoading(true)
        try {
            const query = new URLSearchParams({
                page: pageNum.toString(),
                limit: limit.toString(),
                search: searchTerm
            })
            const res = await fetch(`${API_BASE_URL}/api/v1/public/saved-dataset/${id}/rows?${query}`)
            if (!res.ok) throw new Error("Failed to fetch rows")
            const data = await res.json()
            setTableData(data.data)
            setTableColumns(data.columns)
            setTotalRows(data.total)
            setPage(data.page)
        } catch (err) {
            console.error(err)
        } finally {
            setIsTableLoading(false)
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalRows / limit)) {
            fetchTableData(selectedDatasetId, newPage, search)
        }
    }

    if (!selectedProjectId && !isLoading) {
        return (
            <div className="app-shell-root min-h-screen p-8 flex flex-col items-center justify-center">
                <div className="text-center max-w-lg">
                    <div className="bg-blue-500/10 p-4 rounded-full inline-flex mb-4">
                        <Database className="h-12 w-12 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Select a Folder</h2>
                    <p className="text-slate-500 mb-6">
                        Choose a project folder from the header to view your processed datasets.
                    </p>
                    <div className="flex justify-center">
                        <FolderSelector
                            selectedFolderId={selectedProjectId}
                            onFolderChange={setSelectedProjectId}
                            onCreateFolder={() => setShowCreateFolder(true)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (datasets.length === 0 && !isLoading && selectedProjectId) {
        return (
            <div className="app-shell-root min-h-screen text-slate-900 font-sans">
                <header className="app-standalone-bar sticky top-0 z-30 border-b border-slate-200 bg-white">
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <a href="/dashboard" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors">
                                <ChevronLeft className="h-6 w-6" />
                            </a>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
                        </div>
                        <FolderSelector
                            selectedFolderId={selectedProjectId}
                            onFolderChange={setSelectedProjectId}
                            onCreateFolder={() => setShowCreateFolder(true)}
                        />
                    </div>
                </header>
                <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center">
                    <div className="bg-blue-500/10 p-4 rounded-full inline-flex mb-4">
                        <BarChart3 className="h-12 w-12 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">No Datasets Found in Folder</h2>
                    <p className="text-slate-500 mb-6">
                        This folder doesn't have any processed data yet.
                    </p>
                    <a href="/dashboard/processing" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Go to Processing
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="app-shell-root min-h-screen text-slate-900 font-sans selection:bg-blue-100">
            {/* Top Bar */}
            <div className="app-standalone-bar sticky top-0 z-30 border-b border-slate-200 bg-white">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <a
                            href="/dashboard"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                            title="Go to Dashboard"
                        >
                            <Home className="h-6 w-6" />
                        </a>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
                            <p className="text-xs text-blue-600 font-medium tracking-wide">PREMIUM INTELLIGENCE</p>
                        </div>
                    </div>

                    {/* Dataset & Project Selector */}
                    <div className="flex items-center gap-4">
                        <FolderSelector
                            selectedFolderId={selectedProjectId}
                            onFolderChange={setSelectedProjectId}
                            onCreateFolder={() => setShowCreateFolder(true)}
                        />
                        <div className="h-8 w-px bg-slate-200 mx-2" />
                        <div className="relative group">
                            <select
                                value={selectedDatasetId}
                                onChange={(e) => setSelectedDatasetId(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] transition-all group-hover:border-slate-300 shadow-sm"
                            >
                                {datasets.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => selectedDatasetId && fetchAnalytics(selectedDatasetId)}
                                className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-sm transition-all"
                                title="Refresh Analytics"
                            >
                                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={handleDeleteDataset}
                                disabled={!selectedDatasetId || isDeleting}
                                className="p-2 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg border border-slate-200 shadow-sm transition-all disabled:opacity-50"
                                title="Delete File"
                            >
                                {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="container mx-auto px-6 mt-2 flex gap-6 overflow-x-auto no-scrollbar">
                    <TabButton
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                        icon={LayoutDashboard}
                        label="Overview"
                    />
                    <TabButton
                        active={activeTab === 'supply-chain'}
                        onClick={() => setActiveTab('supply-chain')}
                        icon={Truck}
                        label="Supply Chain"
                    />
                    <TabButton
                        active={activeTab === 'exim-analysis'}
                        onClick={() => setActiveTab('exim-analysis')}
                        icon={TrendingUp}
                        label="EXIM Analysis"
                    />
                    <TabButton
                        active={activeTab === 'data'}
                        onClick={() => setActiveTab('data')}
                        icon={Database}
                        label="Raw Data"
                    />
                </div>
            </div>

            <main className="container mx-auto px-6 py-4 space-y-4">
                {isLoading && !analytics ? (
                    <div className="text-center py-20">
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400"> Analyzing large dataset...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2">
                        <p>{error}</p>
                    </div>
                ) : analytics && (
                    <>
                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <KeyMetrics data={{ ...analytics.metrics, hhi: analytics.intelligence?.hhi }} />
                                <InsightsPanel intelligence={analytics.intelligence} />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <QuarterlyChart data={analytics.charts.quarterly} />
                                    <GeoDistribution data={analytics.charts.geo} dataType={analytics.data_type} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'supply-chain' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <SupplyChain data={analytics.charts.supply_chain} />
                            </div>
                        )}

                        {activeTab === 'exim-analysis' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-600 rounded-lg">
                                                <Table className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Weighted Average Price Profile</h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pivot analysis by product and financial period</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-tighter">Verified Mass Units Only</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="bg-slate-50/50 border-b border-slate-100 italic">
                                                    {eximData?.columns?.map((col: string, i: number) => (
                                                        <th key={i} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {eximData?.data?.length > 0 ? (
                                                    eximData.data.map((row: any, i: number) => (
                                                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                                            {eximData.columns.map((col: string, j: number) => (
                                                                <td key={j} className={`px-6 py-4 whitespace-nowrap text-sm ${j === 0 ? 'text-slate-900 font-black uppercase' : 'text-slate-600 font-bold'}`}>
                                                                    {row[col] || '-'}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan={10} className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting strategic pricing data</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <EXIMIntelligence intelligence={analytics.intelligence} />
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                                    <h3 className="font-bold text-white">Message Data Preview</h3>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-64 shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                {tableColumns.map((col) => (
                                                    <th key={col} className="px-6 py-3 font-semibold whitespace-nowrap">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {isTableLoading ? (
                                                <tr><td colSpan={tableColumns.length} className="p-8 text-center text-slate-400">Loading rows...</td></tr>
                                            ) : tableData.length > 0 ? (
                                                tableData.map((row, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                        {tableColumns.map((col) => (
                                                            <td key={`${i}-${col}`} className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate text-slate-600">
                                                                {row[col]?.toString() || '-'}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={tableColumns.length} className="p-8 text-center text-slate-500">No records found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Page {page} of {Math.ceil(totalRows / limit)}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className="p-2 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-50 hover:bg-white bg-white shadow-sm"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page >= Math.ceil(totalRows / limit)}
                                            className="p-2 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-50 hover:bg-white bg-white shadow-sm"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Folder Creation Modal */}
            {showCreateFolder && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Create New Folder</h3>
                            <button onClick={() => setShowCreateFolder(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Folder Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Q1 Trade Data"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateFolder(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                disabled={!newFolderName.trim() || isCreatingFolder}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isCreatingFolder ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                ${active
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'}
            `}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    )
}

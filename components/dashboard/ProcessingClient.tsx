"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileSpreadsheet, X, ChevronDown, ChevronUp, Download, Loader2, CheckCircle2, AlertCircle, Settings, Filter, Table, Plus, Trash2, Sparkles, Target, Search, Check, LayoutGrid, Save } from 'lucide-react'
import FolderSelector from '@/components/FolderSelector'
import { projectApi } from '@/lib/projectApi'

type DataType = 'import' | 'export' | 'global'
type CleaningMode = 'manual' | 'ai'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface NameMapping {
    sourceNames: string[]
    targetName: string
}

export default function DataProcessingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const datasetIdParam = searchParams.get('datasetId')
    const projectIdParam = searchParams.get('projectId')

    // Project state
    const [selectedProjectId, setSelectedProjectId] = useState<string>(projectIdParam || '')
    const [showCreateFolder, setShowCreateFolder] = useState(false)

    // Basic state
    const [dataType, setDataType] = useState<DataType>('import')
    const [cleaningMode, setCleaningMode] = useState<CleaningMode>('ai')
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

    // AI Configuration
    const [productName, setProductName] = useState('')
    const [synonyms, setSynonyms] = useState('')
    const [casNumber, setCasNumber] = useState('')

    // Advanced AI Options
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [usePerplexity, setUsePerplexity] = useState(false)
    const [perplexityApiKey, setPerplexityApiKey] = useState('')
    const [batchSize, setBatchSize] = useState(50)
    const [exactMatch, setExactMatch] = useState(true)
    const [casDetection, setCasDetection] = useState(true)
    const [fuzzyMatching, setFuzzyMatching] = useState(true)
    const [technicalSpec, setTechnicalSpec] = useState(true)
    const [synonymMatching, setSynonymMatching] = useState(true)
    const [derivativeDetection, setDerivativeDetection] = useState(true)

    // Processing state
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingStatus, setProcessingStatus] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Results state
    const [results, setResults] = useState<any>(null)
    const [showPatterns, setShowPatterns] = useState(true)

    // Manual cleaning state
    const [uploadedDataset, setUploadedDataset] = useState<any>(null)
    const [uniqueNames, setUniqueNames] = useState<string[]>([])
    const [excludeKeywords, setExcludeKeywords] = useState('')
    const [includeKeywords, setIncludeKeywords] = useState('')
    const [filterStats, setFilterStats] = useState<any>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [showMappings, setShowMappings] = useState(true)
    const [selectedSourceNames, setSelectedSourceNames] = useState<string[]>([])
    const [targetName, setTargetName] = useState('')
    const [nameMappings, setNameMappings] = useState<NameMapping[]>([])
    const [cleanedData, setCleanedData] = useState<any>(null)
    const [sessionState, setSessionState] = useState<'IDLE' | 'MERGED' | 'CLEANED' | 'FILTERED' | 'READY'>('IDLE')
    const [datasetName, setDatasetName] = useState('')
    const [filteredPreviewData, setFilteredPreviewData] = useState<any[]>([])
    const [previewColumns, setPreviewColumns] = useState<string[]>([])
    const [isFiltersFinalized, setIsFiltersFinalized] = useState(false)
    const [nameSearchTerm, setNameSearchTerm] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // Save Dataset State
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [saveName, setSaveName] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Debounce filter updates
    useEffect(() => {
        if (!uploadedDataset || cleaningMode !== 'manual' || isFiltersFinalized) return

        const timer = setTimeout(() => {
            updateFilterStats()
        }, 300)

        return () => clearTimeout(timer)
    }, [excludeKeywords, includeKeywords, uploadedDataset, isFiltersFinalized])

    useEffect(() => {
        if (datasetIdParam) {
            loadExistingDataset(datasetIdParam)
        }
    }, [datasetIdParam])

    const loadExistingDataset = async (id: string) => {
        setIsProcessing(true)
        setProcessingStatus('Loading dataset from project...')
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/public/load-session/${id}`)
            if (!response.ok) throw new Error('Failed to load dataset session')

            const data = await response.json()
            setUploadedDataset(data)
            setUniqueNames(data.unique_names || [])
            setSessionState(data.session_state || 'MERGED')
            setFilteredPreviewData(data.preview || [])
            setPreviewColumns(data.columns || [])
            setFilterStats({
                original_rows: data.row_count,
                filtered_rows: data.row_count,
                removed_rows: 0,
                removal_percentage: 0
            })
            if (data.data_type) {
                setDataType(data.data_type as DataType)
            }
            setProcessingStatus('Dataset loaded successfully.')
        } catch (err: any) {
            console.error('Load dataset error:', err)
            setError(err.message || 'Failed to load existing dataset')
        } finally {
            setIsProcessing(false)
        }
    }

    const updateFilterStats = async () => {
        if (!uploadedDataset || !uploadedDataset.dataset_id) return

        try {
            const formData = new FormData()
            if (excludeKeywords) formData.append('exclude_keywords', excludeKeywords)
            if (includeKeywords) formData.append('include_keywords', includeKeywords)

            const response = await fetch(`${API_BASE_URL}/api/v1/public/filter-preview/${uploadedDataset.dataset_id}`, {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const data = await response.json()
                setFilterStats(data)

                // MANDATORY POC REQUIREMENT: Update preview data directly from the filtered state
                if (data.preview) {
                    setFilteredPreviewData(data.preview)
                }
                if (data.columns) {
                    setPreviewColumns(data.columns)
                }
            }
        } catch (err) {
            console.error('Filter preview error:', err)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
        }
    }

    const handleProcess = async () => {
        if (!selectedProjectId) {
            setError('Please select a folder (project) first')
            return
        }

        if (uploadedFiles.length === 0) {
            setError('Please select at least one file')
            return
        }

        if (cleaningMode === 'ai' && !productName.trim()) {
            setError('Please enter a product name for AI cleaning')
            return
        }

        setIsProcessing(true)
        setError(null)
        setResults(null)
        setUploadedDataset(null)

        try {
            setProcessingStatus(`Uploading and analyzing ${uploadedFiles.length} file(s)...`)

            const formData = new FormData()
            uploadedFiles.forEach((file) => {
                formData.append('files', file)
            })
            formData.append('data_type', dataType)
            formData.append('project_id', selectedProjectId)

            if (cleaningMode === 'ai') {
                formData.append('product_name', productName)
                formData.append('synonyms', synonyms)
                formData.append('cas_number', casNumber)
                formData.append('cleaning_mode', 'ai_enhanced')
                // Convert boolean to string "true"/"false" but ensure backend handles it, 
                // OR better, checking backend `public.py`: use_perplexity: bool = Form(True). 
                // FastAPI Form handles boolean strings "true", "on", "1" etc.
                formData.append('use_perplexity', String(usePerplexity))
                formData.append('batch_size', String(batchSize))
                if (perplexityApiKey) formData.append('perplexity_api_key', perplexityApiKey)

                // Advanced features
                formData.append('exact_match', String(exactMatch))
                formData.append('cas_detection', String(casDetection))
                formData.append('fuzzy_matching', String(fuzzyMatching))
                formData.append('technical_spec', String(technicalSpec))
                formData.append('synonym_matching', String(synonymMatching))
                formData.append('derivative_detection', String(derivativeDetection))
            }

            const url = cleaningMode === 'ai' ? `${API_BASE_URL}/api/v1/public/upload-ai` : `${API_BASE_URL}/api/v1/public/upload-manual`

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Processing failed')
            }

            const data = await response.json()

            if (cleaningMode === 'ai') {
                setResults(data)
                setCleanedData({
                    row_count: data.statistics.kept_rows,
                    download_url: data.download_urls?.cleaned
                })
                setUploadedDataset({ dataset_id: data.dataset_id, row_count: data.statistics.original_rows })
                setSessionState('CLEANED')
                setProcessingStatus('AI Cleaning complete. Review the results below.')
            } else {
                setUploadedDataset(data)
                setUniqueNames(data.unique_names || [])
                setSessionState('MERGED')
                setFilteredPreviewData(data.preview || [])
                setPreviewColumns(data.columns || [])
                setFilterStats({
                    original_rows: data.row_count,
                    filtered_rows: data.row_count,
                    removed_rows: 0,
                    removal_percentage: 0
                })
                setProcessingStatus('Files merged successfully. Ready for cleaning.')
                setIsFiltersFinalized(false)
            }
        } catch (err: any) {
            console.error('Processing error:', err)
            let errorMessage = 'An error occurred'

            if (err.message === 'Failed to fetch') {
                errorMessage = `Cannot connect to backend at ${API_BASE_URL}. Make sure the backend server is running.`
            } else if (err.response?.data?.detail) {
                // Handle array of errors or object
                if (typeof err.response.data.detail === 'object') {
                    errorMessage = JSON.stringify(err.response.data.detail)
                } else {
                    errorMessage = err.response.data.detail
                }
            } else if (err.message) {
                errorMessage = err.message
            } else if (typeof err === 'object') {
                errorMessage = JSON.stringify(err)
            } else if (typeof err === 'string') {
                errorMessage = err
            }

            setError(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleFinalizeFilters = async () => {
        if (!uploadedDataset || !uploadedDataset.dataset_id) return

        setIsProcessing(true)
        setProcessingStatus('Finalizing filters and extracting unique names...')

        try {
            const formData = new FormData()
            if (excludeKeywords) formData.append('exclude_keywords', excludeKeywords)
            if (includeKeywords) formData.append('include_keywords', includeKeywords)

            const response = await fetch(`${API_BASE_URL}/api/v1/public/finalize-filters/${uploadedDataset.dataset_id}`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to finalize filters')
            }

            const data = await response.json()

            // Update the master session states
            setUniqueNames(data.unique_names || [])
            setUploadedDataset({
                ...uploadedDataset,
                row_count: data.row_count
            })

            // Calculate final stats to freeze them on the UI
            const removed = uploadedDataset.row_count - data.row_count
            const pct = uploadedDataset.row_count > 0 ? ((removed / uploadedDataset.row_count) * 100).toFixed(1) : 0

            setFilterStats({
                original_rows: uploadedDataset.row_count,
                filtered_rows: data.row_count,
                removed_rows: removed,
                removal_percentage: pct
            })

            setIsFiltersFinalized(true)
            setShowMappings(true) // Auto-expand cleaning stage
            setProcessingStatus('Filters applied. Unique names updated. Ready for standardization.')
        } catch (err: any) {
            setError(err.message || 'Failed to finalize filters')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSaveDataset = async () => {
        if (!uploadedDataset?.dataset_id || !saveName.trim()) return

        setIsSaving(true)
        try {
            const formData = new FormData()
            formData.append('name', saveName)

            const response = await fetch(`${API_BASE_URL}/api/v1/public/save-dataset/${uploadedDataset.dataset_id}`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('Failed to save dataset')

            // Success feedback
            setProcessingStatus('Dataset saved successfully!')
            setShowSaveModal(false)
            // Optional: Redirect or reset? For now just show success state.
            alert('Dataset saved successfully! You can find it in your dashboard.')

        } catch (err: any) {
            setError(err.message || 'Failed to save')
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddMapping = () => {
        if (selectedSourceNames.length === 0 || !targetName.trim()) {
            return
        }

        setNameMappings([...nameMappings, {
            sourceNames: [...selectedSourceNames],
            targetName: targetName.trim()
        }])

        setSelectedSourceNames([])
        setTargetName('')
    }

    const handleClearMappings = () => {
        setNameMappings([])
    }

    const [moleculeName, setMoleculeName] = useState('')

    const handleApplyCleaning = async () => {
        if (!uploadedDataset) return

        setIsProcessing(true)
        setError(null)
        setProcessingStatus(cleaningMode === 'ai' ? 'Running AI-powered cleaning...' : 'Applying manual mappings...')

        try {
            const formData = new FormData()
            formData.append('mode', cleaningMode)

            if (cleaningMode === 'manual') {
                formData.append('mappings', JSON.stringify(nameMappings))
            } else {
                formData.append('product_name', productName)
                formData.append('synonyms', synonyms)
                formData.append('cas_number', casNumber)
                if (usePerplexity) {
                    formData.set('mode', 'ai_enhanced')
                }
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/public/clean-dataset/${uploadedDataset.dataset_id}`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Cleaning failed')
            }

            const data = await response.json()
            setCleanedData(data)
            setSessionState('CLEANED')
            setProcessingStatus('Cleaning complete. Ready for Molecule Focus.')
        } catch (err: any) {
            setError(err.message || 'Cleaning failed')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleFilterMolecule = async () => {
        if (!uploadedDataset || sessionState !== 'CLEANED') {
            setError('Please complete cleaning before molecule filtering')
            return
        }

        if (!moleculeName.trim()) {
            setError('Please enter a molecule name')
            return
        }

        setIsProcessing(true)
        setError(null)
        setProcessingStatus(`Filtering for ${moleculeName}...`)

        try {
            const formData = new FormData()
            formData.append('molecule_name', moleculeName)

            const response = await fetch(`${API_BASE_URL}/api/v1/public/filter-molecule/${uploadedDataset.dataset_id}`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Filtering failed')
            }

            const data = await response.json()
            setCleanedData(data) // The Filtered dataframe is now the "Current" cleaned data
            setSessionState('FILTERED')
            setProcessingStatus('Filtering complete. Ready for Analytics.')
        } catch (err: any) {
            setError(err.message || 'Filtering failed')
        } finally {
            setIsProcessing(false)
        }
    }

    const [analytics, setAnalytics] = useState<any>(null)

    const handleFetchAnalytics = async () => {
        if (!uploadedDataset || (sessionState !== 'CLEANED' && sessionState !== 'FILTERED')) {
            setError('Please complete cleaning before viewing analytics')
            return
        }

        setIsProcessing(true)
        setError(null)
        setProcessingStatus('Generating analytics from master dataframe...')

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/public/analytics/${uploadedDataset.dataset_id}`)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to fetch analytics')
            }

            const data = await response.json()
            setAnalytics(data)
            setSessionState('READY')
            setProcessingStatus('Analytics ready! Redirecting...')

            // Redirect to analytics page with project and dataset context
            if (uploadedDataset || data.dataset_id) {
                const dataset_id = uploadedDataset?.dataset_id || data.dataset_id;
                router.push(`/dashboard/analytics?datasetId=${dataset_id}&projectId=${selectedProjectId}`)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch analytics')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = async (type: 'cleaned' | 'rejected') => {
        try {
            let url = null;
            if (cleaningMode === 'ai' && results) {
                url = type === 'cleaned' ? results.download_urls?.cleaned : results.download_urls?.rejected;
            } else if (cleanedData) {
                url = type === 'cleaned' ? cleanedData.download_url : (type === 'rejected' ? `/api/v1/public/download-rejected/${uploadedDataset?.dataset_id}` : null);
            }

            if (!url) {
                setError(`No ${type} data available for download`);
                return;
            }

            const response = await fetch(`${API_BASE_URL}${url}`)
            if (!response.ok) throw new Error('Download failed')

            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = downloadUrl
            const filename = type === 'cleaned' ? `${dataType}_cleaned.xlsx` : `${dataType}_rejected.xlsx`;
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(downloadUrl)
            document.body.removeChild(a)
        } catch (err) {
            setError('Download failed')
            console.error('Download error:', err)
        }
    }

    const [newFolderName, setNewFolderName] = useState('')
    const [isCreatingFolder, setIsCreatingFolder] = useState(false)

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return
        setIsCreatingFolder(true)
        try {
            const project = await projectApi.createProject({
                name: newFolderName,
                description: `Data processing folder for ${dataType}`,
                project_type: 'product_analysis'
            })
            setSelectedProjectId(project.id)
            setShowCreateFolder(false)
            setNewFolderName('')
            // FolderSelector will refresh because it uses useEffect on mount or we can trigger it
        } catch (err: any) {
            setError('Failed to create folder')
        } finally {
            setIsCreatingFolder(false)
        }
    }

    const getDataTypeLabel = () => {
        if (dataType === 'import') return 'Processing Import Trade Data'
        if (dataType === 'export') return 'Processing Export Trade Data'
        return 'Processing Global Trade Data'
    }

    const getPatternLabel = (pattern: string) => {
        const labels: Record<string, string> = {
            'exact_match': '🔍 Exact product name match',
            'cas_match': '🔬 CAS number detected',
            'synonym_match': '📝 Synonym match',
            'fuzzy_match': '🎯 Fuzzy match (typo correction)',
            'technical_spec': '⚙️ Technical specification',
            'derivative_match': '🧪 Chemical derivative'
        }
        return labels[pattern] || pattern
    }

    const getMappedCount = () => {
        const uniqueSet = new Set<string>()
        nameMappings.forEach(m => m.sourceNames.forEach(n => uniqueSet.add(n)))
        return uniqueSet.size
    }

    return (
        <div className="app-shell-root min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <ArrowLeft className="h-5 w-5 text-slate-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Trade Data Processing
                                </h1>
                                <p className="text-xs text-slate-500">Folder-centric cleaning workflow</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FolderSelector
                                selectedFolderId={selectedProjectId}
                                onFolderChange={setSelectedProjectId}
                                onCreateFolder={() => setShowCreateFolder(true)}
                            />
                            <div className="h-8 w-px bg-slate-200 mx-2" />
                            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8 max-w-6xl">
                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-900">{error}</p>
                    </div>
                )}

                {/* Data Type Selector */}
                <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                    <label className="block text-slate-900 font-semibold mb-2">Select Data Type</label>
                    <select
                        value={dataType}
                        onChange={(e) => setDataType(e.target.value as DataType)}
                        className="w-full md:w-64 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={isProcessing || !!results || !!uploadedDataset}
                    >
                        <option value="import">Import</option>
                        <option value="export">Export</option>
                        <option value="global">Global</option>
                    </select>
                    <p className="mt-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {getDataTypeLabel()}
                    </p>
                </div>

                {/* Cleaning Mode Selector */}
                <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                    <label className="block text-slate-900 font-semibold mb-2">Select Cleaning Method</label>
                    <select
                        value={cleaningMode}
                        onChange={(e) => setCleaningMode(e.target.value as CleaningMode)}
                        className="w-full md:w-64 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={isProcessing || !!results || !!uploadedDataset}
                    >
                        <option value="manual">Manual Cleaning</option>
                        <option value="ai">AI-Powered Cleaning</option>
                    </select>

                    {cleaningMode === 'ai' && (
                        <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-purple-900 text-sm">🤖 AI will automatically filter product descriptions based on your inputs</p>
                        </div>
                    )}

                    {cleaningMode === 'manual' && (
                        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-900 text-sm">✋ You will manually map and filter commercial names</p>
                        </div>
                    )}
                </div>

                {/* AI Configuration - Only show in AI mode */}
                {cleaningMode === 'ai' && !uploadedDataset && (
                    <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">AI Cleaning Configuration</h3>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-slate-700 text-sm mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Aniline"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    disabled={isProcessing || !!results}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm mb-2">Synonyms (comma-separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Phenylamine, Aminobenzene"
                                    value={synonyms}
                                    onChange={(e) => setSynonyms(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    disabled={isProcessing || !!results}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm mb-2">CAS Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 62-53-3"
                                    value={casNumber}
                                    onChange={(e) => setCasNumber(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    disabled={isProcessing || !!results}
                                />
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-2"
                            disabled={isProcessing || !!results}
                        >
                            <Settings className="h-4 w-4" />
                            Advanced AI Options
                            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {showAdvanced && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-4">
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={usePerplexity}
                                            onChange={(e) => setUsePerplexity(e.target.checked)}
                                            className="rounded"
                                            disabled={isProcessing || !!results}
                                        />
                                        <span className="text-slate-700">Use Perplexity AI Enhancement</span>
                                    </label>
                                    {usePerplexity && (
                                        <input
                                            type="password"
                                            placeholder="Perplexity API Key"
                                            value={perplexityApiKey}
                                            onChange={(e) => setPerplexityApiKey(e.target.value)}
                                            className="mt-2 w-full px-4 py-2 bg-white border border-slate-300 rounded-lg"
                                            disabled={isProcessing || !!results}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-slate-700 text-sm mb-2">AI Batch Size: {batchSize}</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setBatchSize(Math.max(10, batchSize - 10))}
                                            className="px-3 py-1 bg-slate-200 rounded"
                                            disabled={isProcessing || !!results}
                                        >-</button>
                                        <input
                                            type="range"
                                            min="10"
                                            max="200"
                                            step="10"
                                            value={batchSize}
                                            onChange={(e) => setBatchSize(Number(e.target.value))}
                                            className="flex-1"
                                            disabled={isProcessing || !!results}
                                        />
                                        <button
                                            onClick={() => setBatchSize(Math.min(200, batchSize + 10))}
                                            className="px-3 py-1 bg-slate-200 rounded"
                                            disabled={isProcessing || !!results}
                                        >+</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-medium mb-2">AI Cleaning Features:</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} disabled={isProcessing || !!results} />
                                            <span className="text-sm">Exact name matching</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={casDetection} onChange={(e) => setCasDetection(e.target.checked)} disabled={isProcessing || !!results} />
                                            <span className="text-sm">CAS number detection</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={fuzzyMatching} onChange={(e) => setFuzzyMatching(e.target.checked)} disabled={isProcessing || !!results} />
                                            <span className="text-sm">Fuzzy matching for typos</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={technicalSpec} onChange={(e) => setTechnicalSpec(e.target.checked)} disabled={isProcessing || !!results} />
                                            <span className="text-sm">Technical spec recognition</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={synonymMatching} onChange={(e) => setSynonymMatching(e.target.checked)} disabled={isProcessing || !!results} />
                                            <span className="text-sm">Synonym matching</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={derivativeDetection} onChange={(e) => setDerivativeDetection(e.target.checked)} disabled={isProcessing || !!results} />
                                            <span className="text-sm">Derivative detection</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* File Upload */}
                <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                    <div className="text-center border-2 border-dashed border-slate-300 rounded-xl p-8">
                        <Upload className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Drag and drop files here</h3>
                        <p className="text-slate-600 text-sm mb-4">Limit 200MB per file • XLSX</p>
                        <label className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold cursor-pointer transition-all hover:scale-105">
                            Browse Files
                            <input
                                type="file"
                                multiple
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isProcessing || !!results || !!uploadedDataset}
                            />
                        </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                        <div className="mt-6 space-y-2">
                            {uploadedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                        <span className="text-slate-900">{file.name}</span>
                                    </div>
                                    {!results && !isProcessing && !uploadedDataset && (
                                        <button
                                            onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {uploadedFiles.length > 0 && !results && !uploadedDataset && (
                        <button
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {processingStatus}
                                </>
                            ) : (
                                `LOAD AND MERGE ${dataType.toUpperCase()} FILES`
                            )}
                        </button>
                    )}
                </div>

                {/* Manual Cleaning Workflow - Only show after upload in manual mode */}
                {cleaningMode === 'manual' && uploadedDataset && (
                    <>
                        {/* Success Banners */}
                        <div className="mb-6 space-y-3">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <p className="text-green-900 font-medium">✅ Loaded {uploadedDataset.row_count.toLocaleString()} rows from {uploadedFiles.length} file(s)</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <p className="text-green-900 font-medium">✅ Found {uploadedDataset.unique_names_count.toLocaleString()} unique commercial names</p>
                            </div>
                        </div>

                        {/* Step 2: Pre-Filter Data */}
                        <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-slate-900">Pre-Filter Data (Optional)</h3>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">Filter out unwanted entries before extracting unique names</p>
                            </div>

                            <div className="p-6">
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-slate-700 text-sm mb-2 flex items-center gap-2">
                                            <span className="text-red-500">⊗</span>
                                            Exclude entries containing (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., TESTING, SAMPLE, TRIAL"
                                            value={excludeKeywords}
                                            onChange={(e) => setExcludeKeywords(e.target.value)}
                                            disabled={!uploadedDataset}
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 text-sm mb-2 flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            Include only entries containing (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., ANILINE, CHEMICAL"
                                            value={includeKeywords}
                                            onChange={(e) => setIncludeKeywords(e.target.value)}
                                            disabled={!uploadedDataset}
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                {/* Real-time Stats Dashboard */}
                                {filterStats && (
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white">
                                            <p className="text-blue-100 text-xs mb-1">ORIGINAL ROWS</p>
                                            <p className="text-3xl font-bold">{filterStats.original_rows.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white">
                                            <p className="text-orange-100 text-xs mb-1">FILTERED ROWS</p>
                                            <p className="text-3xl font-bold">{filterStats.filtered_rows.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-4 text-white">
                                            <p className="text-red-100 text-xs mb-1">REMOVED</p>
                                            <p className="text-3xl font-bold">{filterStats.removed_rows.toLocaleString()}</p>
                                            <p className="text-red-100 text-xs mt-1">↓ {filterStats.removal_percentage}%</p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <button
                                        onClick={handleFinalizeFilters}
                                        disabled={isProcessing || !uploadedDataset || isFiltersFinalized}
                                        className={`w-full px-6 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isFiltersFinalized
                                            ? 'bg-green-100 text-green-700 border-2 border-green-500 cursor-default'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-[1.02]'
                                            }`}
                                    >
                                        {isFiltersFinalized ? (
                                            <>
                                                <CheckCircle2 className="h-5 w-5" />
                                                FILTERS APPLIED TO DATASET
                                            </>
                                        ) : (
                                            <>
                                                <Filter className="h-5 w-5" />
                                                APPLY FILTERS & CONTINUE TO CLEANING
                                            </>
                                        )}
                                    </button>
                                    {isFiltersFinalized && (
                                        <button
                                            onClick={() => setIsFiltersFinalized(false)}
                                            className="mt-2 w-full text-xs text-slate-500 hover:text-blue-600 transition-colors"
                                        >
                                            Edit Filters (Resets unique names)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Preview Merged Data */}
                        <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="w-full px-6 py-4 flex items-center justify-between text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Table className="h-5 w-5 text-blue-600" />
                                    <span className="font-bold text-lg">Preview Merged Data</span>
                                    <span className="text-sm text-slate-600">
                                        ({filterStats ? filterStats.filtered_rows.toLocaleString() : uploadedDataset.row_count.toLocaleString()} rows after filters)
                                    </span>
                                </div>
                                {showPreview ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>

                            {showPreview && filteredPreviewData.length > 0 && (
                                <div className="px-6 pb-6">
                                    <p className="text-sm text-slate-600 mb-4">
                                        Showing {filteredPreviewData.length >= 1000 ? 'top 1,000' : `all ${filteredPreviewData.length.toLocaleString()}`} filtered rows
                                    </p>
                                    <div className="overflow-x-auto overflow-y-auto max-h-96 border border-slate-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                                <tr>
                                                    {previewColumns.map((col: string, idx: number) => (
                                                        <th key={idx} className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-200">
                                                {filteredPreviewData.map((row: any, rowIdx: number) => (
                                                    <tr key={rowIdx} className="hover:bg-slate-50">
                                                        {previewColumns.map((col: string, colIdx: number) => (
                                                            <td key={colIdx} className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap">
                                                                {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Close Preview
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Step 4: Global Name Standardization (New Dropdown UI) */}
                        <div className={`mb-6 bg-white rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] p-6 transition-all ${!isFiltersFinalized ? 'opacity-50 grayscale pointer-events-none' : ''}`}>

                            {/* Header */}
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                Global Name Standardization
                            </h3>
                            <p className="text-sm text-yellow-600 font-medium mb-4">
                                Create New Mapping:
                            </p>

                            {/* Select All Checkbox */}
                            <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={uniqueNames.length > 0 && uniqueNames.every(n => selectedSourceNames.includes(n))}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedSourceNames([...uniqueNames]);
                                        } else {
                                            setSelectedSourceNames([]);
                                        }
                                    }}
                                />
                                <span className="text-sm text-slate-700">Select All Unmapped Names</span>
                            </label>

                            {/* Multi-select Dropdown */}
                            <div className="relative mb-4">
                                <label className="block text-xs text-slate-500 mb-1">
                                    Select Source Names (original names to standardize)
                                </label>

                                {/* Trigger */}
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(!isDropdownOpen);
                                        // Focus search input after a brief delay if opening
                                        if (!isDropdownOpen) {
                                            setTimeout(() => {
                                                const input = document.getElementById('dropdown-search-input');
                                                if (input) input.focus();
                                            }, 50);
                                        }
                                    }}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-left text-sm text-slate-600 bg-white hover:border-slate-400 flex items-center justify-between transition-colors shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                                >
                                    <span>
                                        {selectedSourceNames.length > 0
                                            ? `${selectedSourceNames.length} names selected`
                                            : "Choose an option"}
                                    </span>
                                    {isDropdownOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>

                                {/* Dropdown List (Virtualized / Conditional Render) */}
                                {isDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                        {/* Search Input inside Dropdown */}
                                        <div className="p-2 border-b border-slate-100 sticky top-0 bg-white z-10">
                                            <div className="relative">
                                                <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
                                                <input
                                                    id="dropdown-search-input"
                                                    type="text"
                                                    placeholder="Search names (showing top 100 matches)..."
                                                    value={nameSearchTerm}
                                                    onChange={(e) => setNameSearchTerm(e.target.value)}
                                                    className="w-full pl-8 pr-3 py-1 text-sm text-slate-900 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>

                                        <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                                            {uniqueNames
                                                .filter(name => name.toLowerCase().includes(nameSearchTerm.toLowerCase()))
                                                .slice(0, 100)
                                                .map((name, idx) => {
                                                    const isSelected = selectedSourceNames.includes(name);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center gap-3 transition-colors"
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    setSelectedSourceNames(selectedSourceNames.filter(n => n !== name));
                                                                } else {
                                                                    setSelectedSourceNames([...selectedSourceNames, name]);
                                                                }
                                                                // Keep dropdown open for multi-select
                                                                const input = document.getElementById('dropdown-search-input');
                                                                if (input) input.focus();
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                                                                }`}>
                                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <span className="truncate">{name}</span>
                                                        </div>
                                                    );
                                                })}
                                            {uniqueNames.filter(name => name.toLowerCase().includes(nameSearchTerm.toLowerCase())).length === 0 && (
                                                <div className="px-4 py-8 text-center text-slate-400 text-xs">
                                                    No names found matching "{nameSearchTerm}"
                                                </div>
                                            )}
                                            {uniqueNames.filter(name => name.toLowerCase().includes(nameSearchTerm.toLowerCase())).length > 100 && (
                                                <div className="px-4 py-2 text-center text-slate-400 text-[10px] bg-slate-50 border-t border-slate-100">
                                                    Showing top 100 matches... Refine search to see more.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selected Tags */}
                            {selectedSourceNames.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6 max-h-[120px] overflow-y-auto scrollbar-thin">
                                    {selectedSourceNames.map(name => (
                                        <span key={name} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-md animate-in fade-in zoom-in duration-200">
                                            <span className="truncate max-w-[200px]" title={name}>{name}</span>
                                            <button
                                                onClick={() => setSelectedSourceNames(selectedSourceNames.filter(n => n !== name))}
                                                className="ml-1 text-red-600 hover:text-red-900 focus:outline-none p-0.5 rounded-full hover:bg-red-200 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Target Name Input */}
                            <div className="mb-4">
                                <label className="block text-xs text-slate-500 mb-1">
                                    Target Name (standardized name)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g., Standard Product Name"
                                        value={targetName}
                                        onChange={(e) => setTargetName(e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none shadow-sm"
                                    />
                                    <Target className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                                </div>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={handleAddMapping}
                                disabled={selectedSourceNames.length === 0 || !targetName.trim()}
                                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wide text-sm flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                ADD GLOBAL MAPPING
                            </button>

                            {/* Counter */}
                            <div className="mt-6 border-t border-slate-100 pt-4">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Mapped Global Names</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-orange-500">{getMappedCount()}</span>
                                    <span className="text-lg text-slate-400">/ {uniqueNames.length.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Active Mappings List (Optional display below card if needed, or keep inside) */}
                            {nameMappings.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Active Mappings ({nameMappings.length})</p>
                                        <button onClick={handleClearMappings} className="text-xs text-red-500 hover:text-red-600">Clear All</button>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                                        {nameMappings.map((mapping, idx) => (
                                            <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200 flex justify-between items-center text-xs">
                                                <div>
                                                    <span className="font-bold text-blue-600">{mapping.targetName}</span>
                                                    <span className="text-slate-400 mx-1">←</span>
                                                    <span className="text-slate-500">{mapping.sourceNames.length} sources</span>
                                                </div>
                                                <button onClick={() => setNameMappings(nameMappings.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 5: Master Cleaning Stage */}
                        {sessionState === 'MERGED' && (
                            <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">
                                    {(cleaningMode as string) === 'ai' ? 'Step 4: AI Powered Cleaning' : 'Step 4: Global Name Standardization'}
                                </h3>
                                <p className="text-sm text-slate-600 mb-6">
                                    {(cleaningMode as string) === 'ai'
                                        ? 'AI will normalize product descriptions with deterministic matching.'
                                        : 'Select multiple commercial names and map them to a standardized target name.'}
                                </p>

                                <button
                                    onClick={handleApplyCleaning}
                                    disabled={isProcessing || (cleaningMode === 'manual' && nameMappings.length === 0)}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            CLEANING DATA...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5" />
                                            {(cleaningMode as string) === 'ai' ? 'RUN AI CLEANING' : 'APPLY GLOBAL MAPPINGS'}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Step 6: Molecule Focus (POST-CLEAN ONLY) */}
                        {sessionState === 'CLEANED' && (
                            <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-blue-600" />
                                    Step 5: Molecule Focus
                                </h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Filter the cleaned dataset for a specific molecule/product for targeted analytics.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Enter molecule name (e.g., ANILINE)"
                                            value={moleculeName}
                                            onChange={(e) => setMoleculeName(e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={handleFilterMolecule}
                                        disabled={isProcessing || !moleculeName.trim()}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                                    >
                                        APPLY FILTER
                                    </button>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-xs text-slate-500 italic">This step is optional. You can also proceed directly to analytics.</p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowSaveModal(true)}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <Save className="h-4 w-4" />
                                            SAVE DATASET
                                        </button>
                                        <button
                                            onClick={handleFetchAnalytics}
                                            disabled={isProcessing}
                                            className="text-sm font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                                        >
                                            SKIP TO ANALYTICS →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Modal */}
                        {showSaveModal && (
                            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="font-bold text-lg text-slate-800">Save Cleaned Dataset</h3>
                                        <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-slate-600">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                                            <p className="font-medium mb-1">Dataset Summary:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
                                                <li>Rows: {cleanedData?.row_count.toLocaleString()}</li>
                                                <li>Status: Ready for Analysis</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Dataset Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Q1 Sales Cleaned"
                                                value={saveName}
                                                onChange={(e) => setSaveName(e.target.value)}
                                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                        <button
                                            onClick={() => setShowSaveModal(false)}
                                            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveDataset}
                                            disabled={!saveName.trim() || isSaving}
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            {isSaving ? 'Saving...' : 'Save Dataset'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cleaned Data Results */}
                        {(sessionState === 'CLEANED' || sessionState === 'FILTERED') && cleanedData && (
                            <div className="mb-6 space-y-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    <div>
                                        <p className="text-green-900 font-semibold">
                                            ✅ Processed {cleanedData.row_count.toLocaleString()} rows retained
                                            {filterStats && ` (filtered from ${filterStats.original_rows.toLocaleString()} original rows)`}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                                        <p className="text-blue-100 text-sm mb-1">ORIGINAL ROWS</p>
                                        <p className="text-4xl font-bold">
                                            {filterStats ? filterStats.original_rows.toLocaleString() : (uploadedDataset?.row_count?.toLocaleString() || '-')}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                                        <p className="text-green-100 text-sm mb-1">CLEANED ROWS</p>
                                        <p className="text-4xl font-bold">{cleanedData.row_count.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                                        <p className="text-red-100 text-sm mb-1">REMOVED ROWS</p>
                                        <p className="text-4xl font-bold">
                                            {filterStats
                                                ? (filterStats.original_rows - cleanedData.row_count).toLocaleString()
                                                : (uploadedDataset ? (uploadedDataset.row_count - cleanedData.row_count).toLocaleString() : '-')}
                                        </p>
                                    </div>
                                </div>

                                {/* Step 7: Analytics Navigation */}
                                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <Table className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Step 7: Analytics & Visualization</h4>
                                            <p className="text-sm text-slate-600">
                                                Your data is now cleaned and structured. Proceed to view deep analytics and trends.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleFetchAnalytics}
                                        disabled={isProcessing}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                CALCULATING ANALYTICS...
                                            </>
                                        ) : (
                                            <>
                                                <Target className="h-5 w-5" />
                                                OPEN ANALYTICS DASHBOARD
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={() => handleDownload('cleaned')}
                                    className="w-full px-6 py-3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="h-5 w-5" />
                                    DOWNLOAD CLEANED EXCEL
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* AI Results Dashboard - Only show for AI mode */}
                {results && cleaningMode === 'ai' && (
                    <>
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="text-green-900 font-semibold">✅ AI Cleaning Complete!</p>
                                <p className="text-green-700 text-sm">Your data has been processed successfully</p>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="mb-6 grid grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                                <p className="text-blue-100 text-sm mb-1 font-medium">ORIGINAL ROWS</p>
                                <p className="text-4xl font-bold">{results.statistics.original_rows.toLocaleString()}</p>
                                <p className="text-blue-100 text-xs mt-1">rows</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
                                <p className="text-green-100 text-sm mb-1 font-medium">KEPT ROWS</p>
                                <p className="text-4xl font-bold">{results.statistics.kept_rows.toLocaleString()}</p>
                                <p className="text-green-100 text-xs mt-1">rows</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
                                <p className="text-red-100 text-sm mb-1 font-medium">REMOVED</p>
                                <p className="text-4xl font-bold">{results.statistics.removed_rows.toLocaleString()}</p>
                                <p className="text-red-100 text-xs mt-1">rows</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                                <p className="text-purple-100 text-sm mb-1 font-medium">SUCCESS RATE</p>
                                <p className="text-4xl font-bold">{results.statistics.success_rate}%</p>
                                <p className="text-purple-100 text-xs mt-1">rate</p>
                            </div>
                        </div>

                        {/* Confidence Analysis */}
                        <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Confidence Analysis</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="text-slate-600 text-sm">Mean Confidence</p>
                                    <p className="text-2xl font-bold text-blue-600">{(results.confidence_scores.mean * 100).toFixed(2)}%</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-sm">Median Confidence</p>
                                    <p className="text-2xl font-bold text-blue-600">{(results.confidence_scores.median * 100).toFixed(2)}%</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-sm">Min Confidence</p>
                                    <p className="text-2xl font-bold text-blue-600">{(results.confidence_scores.min * 100).toFixed(2)}%</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-sm">Max Confidence</p>
                                    <p className="text-2xl font-bold text-blue-600">{(results.confidence_scores.max * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Pattern Distribution */}
                        <div className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <button
                                onClick={() => setShowPatterns(!showPatterns)}
                                className="w-full px-6 py-4 flex items-center justify-between text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-semibold">Pattern Type Distribution</span>
                                {showPatterns ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>

                            {showPatterns && (
                                <div className="px-6 pb-6">
                                    <div className="space-y-3">
                                        {Object.entries(results.pattern_distribution).map(([pattern, count]: [string, any]) => {
                                            const maxCount = Math.max(...Object.values(results.pattern_distribution) as number[])
                                            const percentage = (count / maxCount) * 100

                                            return (
                                                <div key={pattern}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-slate-700">{getPatternLabel(pattern)}</span>
                                                        <span className="text-sm font-bold text-blue-600">{count.toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-3">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Analytics Navigation */}
                        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Table className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Next Step: Analytics & Visualization</h4>
                                    <p className="text-sm text-slate-600">
                                        AI cleaning is complete. Proceed to view deep analytics and trends.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleFetchAnalytics}
                                    disabled={isProcessing}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            CALCULATING ANALYTICS...
                                        </>
                                    ) : (
                                        <>
                                            <Target className="h-5 w-5" />
                                            OPEN ANALYTICS DASHBOARD
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowSaveModal(true)}
                                    disabled={isProcessing}
                                    className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    SAVE DATASET
                                </button>
                            </div>
                        </div>

                        {/* Download Buttons */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleDownload('cleaned')}
                                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="h-5 w-5" />
                                DOWNLOAD CLEANED DATA
                            </button>
                            {results.download_urls.rejected && (
                                <button
                                    onClick={() => handleDownload('rejected')}
                                    className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="h-5 w-5" />
                                    DOWNLOAD REJECTED ENTRIES ({results.statistics.removed_rows})
                                </button>
                            )}
                        </div>
                    </>
                )}
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
            </main>
        </div >
    )
}

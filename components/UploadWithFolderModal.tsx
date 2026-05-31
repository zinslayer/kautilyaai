'use client'

import { useState, useRef, useEffect } from 'react'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { X, Loader2, Upload, Folder, Check, FileSpreadsheet } from 'lucide-react'
import { projectApi, ProjectSummary } from '@/lib/projectApi'
import { api } from '@/lib/api'
import CreateFolderModal from './CreateFolderModal'

interface UploadWithFolderModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (datasetId?: string) => void
}

export default function UploadWithFolderModal({ isOpen, onClose, onSuccess }: UploadWithFolderModalProps) {
    const [folders, setFolders] = useState<ProjectSummary[]>([])
    const [selectedFolderId, setSelectedFolderId] = useState<string>('')
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [showCreateFolder, setShowCreateFolder] = useState(false)
    const [error, setError] = useState('')
    const [loadingFolders, setLoadingFolders] = useState(true)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useBodyScrollLock(isOpen)

    useEffect(() => {
        if (isOpen) {
            loadFolders()
        }
    }, [isOpen])

    const loadFolders = async () => {
        try {
            setLoadingFolders(true)
            const data = await projectApi.listProjects(false)
            setFolders(data)
            if (data.length > 0 && !selectedFolderId) {
                setSelectedFolderId(data[0].id)
            }
        } catch (error) {
            console.error('Failed to load folders:', error)
        } finally {
            setLoadingFolders(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files))
            setError('')
        }
    }

    const handleUpload = async () => {
        if (!selectedFolderId) {
            setError('Please select a folder')
            return
        }

        if (files.length === 0) {
            setError('Please select files to upload')
            return
        }

        setUploading(true)
        setError('')

        try {
            const formData = new FormData()
            if (files.length > 0) {
                formData.append('file', files[0])
            }
            formData.append('project_id', selectedFolderId)

            const response = await api.post('/api/v1/datasets/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            onSuccess(response.data.id)
            onClose()

            // Reset
            setFiles([])
            setSelectedFolderId('')
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (err: any) {
            console.error('Failed to upload files:', err)
            const rawError = err.response?.data?.detail
            let message = 'Failed to upload files'

            if (typeof rawError === 'string') {
                message = rawError
            } else if (Array.isArray(rawError)) {
                message = rawError.map((e: any) => e.msg || JSON.stringify(e)).join(', ')
            } else if (rawError && typeof rawError === 'object') {
                message = rawError.msg || JSON.stringify(rawError)
            } else if (err.message) {
                message = err.message
            }

            setError(message)
        } finally {
            setUploading(false)
        }
    }

    const handleFolderCreated = (folderId: string) => {
        setSelectedFolderId(folderId)
        loadFolders()
    }

    if (!isOpen) return null

    return (
        <>
            <div className="app-dialog-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center sm:backdrop-blur-sm">
                <div className="app-dialog-panel max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]">
                    {/* Header */}
                    <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Upload className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Upload Data</h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="app-icon-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                            aria-label="Close upload dialog"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Select Folder */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Step 1: Select Folder *
                                </label>
                                <button
                                    onClick={() => setShowCreateFolder(true)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <Folder className="w-4 h-4" />
                                    New Folder
                                </button>
                            </div>

                            {loadingFolders ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : folders.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-3">No folders yet</p>
                                    <button
                                        onClick={() => setShowCreateFolder(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Create Your First Folder
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                                    {folders.map((folder) => (
                                        <button
                                            key={folder.id}
                                            onClick={() => setSelectedFolderId(folder.id)}
                                            className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${selectedFolderId === folder.id
                                                ? 'bg-blue-50 border-2 border-blue-500'
                                                : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                                                }`}
                                        >
                                            <Folder className={`w-5 h-5 ${selectedFolderId === folder.id ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <div className="flex-1">
                                                <div className={`font-medium ${selectedFolderId === folder.id ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {folder.name}
                                                </div>
                                                {folder.description && (
                                                    <div className="text-xs text-gray-500 truncate">{folder.description}</div>
                                                )}
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {folder.dataset_count} datasets
                                                </div>
                                            </div>
                                            {selectedFolderId === folder.id && (
                                                <Check className="w-5 h-5 text-blue-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Step 2: Select Files */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Step 2: Select Files *
                            </label>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-3" />
                                    <span className="text-sm font-medium text-gray-700 mb-1">
                                        Click to select files
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Excel (.xlsx, .xls) or CSV files
                                    </span>
                                </label>
                            </div>

                            {files.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                                        >
                                            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                                            <span className="text-xs text-gray-500">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="app-dialog-actions flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={onClose}
                                className="min-h-[48px] flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading || !selectedFolderId || files.length === 0}
                                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {uploading ? 'Uploading...' : 'Upload to Folder'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Folder Modal */}
            <CreateFolderModal
                isOpen={showCreateFolder}
                onClose={() => setShowCreateFolder(false)}
                onSuccess={handleFolderCreated}
            />
        </>
    )
}

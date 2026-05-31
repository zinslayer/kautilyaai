'use client'

import { useState, useEffect } from 'react'
import { Folder, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { projectApi, ProjectSummary } from '@/lib/projectApi'

interface FolderSelectorProps {
    selectedFolderId?: string
    onFolderChange: (folderId: string) => void
    onCreateFolder: () => void
    onFolderDeleted?: () => void
}

export default function FolderSelector({
    selectedFolderId,
    onFolderChange,
    onCreateFolder,
    onFolderDeleted,
}: FolderSelectorProps) {
    const [folders, setFolders] = useState<ProjectSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        loadFolders()
    }, [])

    const loadFolders = async () => {
        try {
            const data = await projectApi.listProjects(false)
            setFolders(data)

            if (!selectedFolderId && data.length > 0) {
                onFolderChange(data[0].id)
            }
        } catch (error) {
            console.error('Failed to load folders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteFolder = async (e: React.MouseEvent, folderId: string, folderName: string) => {
        e.stopPropagation()
        if (confirm(`Are you sure you want to permanently delete "${folderName}" and all its contents? This cannot be undone.`)) {
            try {
                await projectApi.deleteProject(folderId)
                await loadFolders()
                if (selectedFolderId === folderId) {
                    onFolderChange('')
                }
                onFolderDeleted?.()
            } catch {
                alert('Failed to delete folder')
            }
        }
    }

    const selectedFolder = folders.find((f) => f.id === selectedFolderId)

    if (loading) {
        return (
            <div className="flex min-w-[200px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span className="text-sm text-slate-600">Loading...</span>
            </div>
        )
    }

    if (folders.length === 0) {
        return (
            <button onClick={onCreateFolder} className="btn-primary">
                <Plus className="h-4 w-4" />
                Create First Folder
            </button>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex min-w-[240px] items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition hover:border-blue-300"
            >
                <Folder className="h-5 w-5 text-blue-600" />
                <div className="flex-1 text-left">
                    <div className="text-xs text-slate-500">Current Folder</div>
                    <div className="truncate text-sm font-medium text-slate-900">{selectedFolder?.name || 'Select a folder'}</div>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                onCreateFolder()
                            }}
                            className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 transition hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">Create New Folder</span>
                        </button>

                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-slate-50 ${
                                    folder.id === selectedFolderId ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => {
                                    onFolderChange(folder.id)
                                    setIsOpen(false)
                                }}
                            >
                                <Folder className={`h-4 w-4 ${folder.id === selectedFolderId ? 'text-blue-600' : 'text-slate-400'}`} />
                                <div className="flex-1 text-left">
                                    <div className={`text-sm font-medium ${folder.id === selectedFolderId ? 'text-blue-600' : 'text-slate-900'}`}>
                                        {folder.name}
                                    </div>
                                    {folder.description && <div className="truncate text-xs text-slate-500">{folder.description}</div>}
                                    <div className="mt-1 text-xs text-slate-400">
                                        {folder.dataset_count} datasets • {folder.report_count} reports
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteFolder(e, folder.id, folder.name)}
                                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                    title="Delete Folder"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

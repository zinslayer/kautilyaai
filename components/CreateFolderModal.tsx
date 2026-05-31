'use client'

import { useState } from 'react'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { X, Loader2, Folder } from 'lucide-react'
import { projectApi } from '@/lib/projectApi'

interface CreateFolderModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (folderId: string) => void
}

export default function CreateFolderModal({ isOpen, onClose, onSuccess }: CreateFolderModalProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useBodyScrollLock(isOpen)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            console.log('Creating project with data:', { name, description })
            const project = await projectApi.createProject({
                name,
                description: description || undefined,
                project_type: 'product_analysis', // Default type
                upstream_materials: [],
                downstream_products: [],
                tags: []
            })
            console.log('Project created successfully:', project)

            onSuccess(project.id)
            onClose()

            // Reset form
            setName('')
            setDescription('')
        } catch (err: any) {
            console.error('Failed to create folder:', err)
            console.error('Error response data:', err.response?.data)

            const rawError = err.response?.data?.detail
            let message = 'Failed to create folder'

            if (typeof rawError === 'string') {
                message = rawError
            } else if (Array.isArray(rawError)) {
                message = rawError.map(e => e.msg || JSON.stringify(e)).join(', ')
            } else if (rawError && typeof rawError === 'object') {
                message = rawError.msg || JSON.stringify(rawError)
            } else if (err.message) {
                message = err.message
            }

            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-dialog-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center sm:backdrop-blur-sm">
            <div className="app-dialog-panel w-full max-w-md rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Folder className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Create New Folder</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="app-icon-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                        aria-label="Close dialog"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Folder Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                            placeholder="e.g., Aniline Analysis"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                            rows={3}
                            placeholder="Brief description of this folder..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="app-dialog-actions flex flex-col gap-3 pt-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-[48px] flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Creating...' : 'Create Folder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

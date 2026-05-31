'use client'

import { useState } from 'react'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { X, Loader2 } from 'lucide-react'
import { projectApi, CreateProjectData } from '@/lib/projectApi'

interface CreateProjectModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
    const [formData, setFormData] = useState<CreateProjectData>({
        name: '',
        description: '',
        project_type: 'product_analysis',
        target_product_name: '',
        target_product_cas: '',
        target_product_description: '',
        upstream_materials: [],
        downstream_products: [],
        tags: []
    })

    const [upstreamInput, setUpstreamInput] = useState('')
    const [downstreamInput, setDownstreamInput] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useBodyScrollLock(isOpen)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await projectApi.createProject(formData)
            onSuccess()
            onClose()
            // Reset form
            setFormData({
                name: '',
                description: '',
                project_type: 'product_analysis',
                target_product_name: '',
                target_product_cas: '',
                target_product_description: '',
                upstream_materials: [],
                downstream_products: [],
                tags: []
            })
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create project')
        } finally {
            setLoading(false)
        }
    }

    const addUpstream = () => {
        if (upstreamInput.trim()) {
            setFormData(prev => ({
                ...prev,
                upstream_materials: [...(prev.upstream_materials || []), upstreamInput.trim()]
            }))
            setUpstreamInput('')
        }
    }

    const removeUpstream = (index: number) => {
        setFormData(prev => ({
            ...prev,
            upstream_materials: prev.upstream_materials?.filter((_, i) => i !== index) || []
        }))
    }

    const addDownstream = () => {
        if (downstreamInput.trim()) {
            setFormData(prev => ({
                ...prev,
                downstream_products: [...(prev.downstream_products || []), downstreamInput.trim()]
            }))
            setDownstreamInput('')
        }
    }

    const removeDownstream = (index: number) => {
        setFormData(prev => ({
            ...prev,
            downstream_products: prev.downstream_products?.filter((_, i) => i !== index) || []
        }))
    }

    const addTag = () => {
        if (tagInput.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()]
            }))
            setTagInput('')
        }
    }

    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter((_, i) => i !== index) || []
        }))
    }

    return (
        <div className="app-dialog-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center sm:backdrop-blur-sm">
            <div className="app-dialog-panel max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Create New Project</h2>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Aniline Value Chain Analysis"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Brief description of the project..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Type *
                            </label>
                            <select
                                required
                                value={formData.project_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value as any }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="product_analysis">Product Analysis</option>
                                <option value="value_chain_analysis">Value Chain Analysis</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Target Product</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.target_product_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, target_product_name: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Aniline"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CAS Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.target_product_cas}
                                    onChange={(e) => setFormData(prev => ({ ...prev, target_product_cas: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 62-53-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Description
                            </label>
                            <textarea
                                value={formData.target_product_description}
                                onChange={(e) => setFormData(prev => ({ ...prev, target_product_description: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={2}
                                placeholder="Brief description of the target product..."
                            />
                        </div>
                    </div>

                    {/* Upstream Materials */}
                    <div className="space-y-3 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Upstream Raw Materials</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={upstreamInput}
                                onChange={(e) => setUpstreamInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUpstream())}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add upstream material (e.g., Benzene)"
                            />
                            <button
                                type="button"
                                onClick={addUpstream}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.upstream_materials?.map((material, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                    {material}
                                    <button
                                        type="button"
                                        onClick={() => removeUpstream(index)}
                                        className="hover:bg-blue-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Downstream Products */}
                    <div className="space-y-3 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Downstream Products</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={downstreamInput}
                                onChange={(e) => setDownstreamInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDownstream())}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add downstream product (e.g., MDI)"
                            />
                            <button
                                type="button"
                                onClick={addDownstream}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.downstream_products?.map((product, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                                >
                                    {product}
                                    <button
                                        type="button"
                                        onClick={() => removeDownstream(index)}
                                        className="hover:bg-green-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add tag for categorization"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                        className="hover:bg-gray-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

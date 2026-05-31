'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Folder, Calendar, Database, FileText, TrendingUp, Archive } from 'lucide-react'
import { projectApi, ProjectSummary } from '@/lib/projectApi'
import CreateProjectModal from '@/components/CreateProjectModal'

export default function ProjectsPage() {
    const [projects, setProjects] = useState<ProjectSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [includeArchived, setIncludeArchived] = useState(false)

    const loadProjects = async () => {
        try {
            setLoading(true)
            const data = await projectApi.listProjects(includeArchived)
            setProjects(data)
        } catch (error) {
            console.error('Failed to load projects:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProjects()
    }, [includeArchived])

    const handleProjectCreated = () => {
        loadProjects()
    }

    return (
        <div className="app-shell-root min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
                        <p className="text-gray-600">Manage your chemistry product and value chain analysis projects</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5" />
                        New Project
                    </button>
                </div>

                {/* Filter */}
                <div className="mb-6 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeArchived}
                            onChange={(e) => setIncludeArchived(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Show archived projects</span>
                    </label>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20">
                        <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-gray-600 mb-6">Create your first project to get started</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/dashboard/projects/${project.id}`}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 h-full">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Folder className="w-5 h-5 text-blue-600" />
                                                {project.status === 'archived' && (
                                                    <Archive className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {project.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    {project.target_product_name && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm font-medium text-blue-900">
                                                {project.target_product_name}
                                            </p>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {project.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Database className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{project.dataset_count} datasets</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{project.report_count} reports</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <TrendingUp className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{project.b2b_search_count} B2B searches</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                {new Date(project.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.project_type === 'product_analysis'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {project.project_type === 'product_analysis' ? 'Product Analysis' : 'Value Chain Analysis'}
                                        </span>
                                        {project.status === 'completed' && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Completed
                                            </span>
                                        )}
                                        {project.status === 'archived' && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                Archived
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            <CreateProjectModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleProjectCreated}
            />
        </div>
    )
}

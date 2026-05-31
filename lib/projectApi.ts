// Project API client
import { api } from './api';

export interface Project {
    id: string;
    organization_id: string;
    created_by: string;
    name: string;
    description?: string;
    project_type: 'product_analysis' | 'value_chain_analysis';
    status: 'active' | 'completed' | 'archived';
    target_product_name?: string;
    target_product_cas?: string;
    target_product_description?: string;
    upstream_materials: string[];
    downstream_products: string[];
    tags: string[];
    created_at: string;
    updated_at: string;
    archived_at?: string;
}

export interface ProjectSummary extends Omit<Project, 'organization_id' | 'created_by' | 'target_product_cas' | 'target_product_description' | 'upstream_materials' | 'downstream_products' | 'tags' | 'archived_at'> {
    dataset_count: number;
    b2b_search_count: number;
    value_chain_count: number;
    market_estimation_count: number;
    report_count: number;
}

export interface ProjectDetail extends Project {
    dataset_count: number;
    b2b_search_count: number;
    value_chain_count: number;
    market_estimation_count: number;
    report_count: number;
    storage_path: string;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    project_type: 'product_analysis' | 'value_chain_analysis';
    target_product_name?: string;
    target_product_cas?: string;
    target_product_description?: string;
    upstream_materials?: string[];
    downstream_products?: string[];
    tags?: string[];
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    project_type?: 'product_analysis' | 'value_chain_analysis';
    status?: 'active' | 'completed' | 'archived';
    target_product_name?: string;
    target_product_cas?: string;
    target_product_description?: string;
    upstream_materials?: string[];
    downstream_products?: string[];
    tags?: string[];
}

export const projectApi = {
    // Create a new project
    async createProject(data: CreateProjectData): Promise<Project> {
        const response = await api.post('/api/v1/projects', data);
        return response.data;
    },

    // List all projects
    async listProjects(includeArchived: boolean = false): Promise<ProjectSummary[]> {
        const response = await api.get('/api/v1/projects', {
            params: { include_archived: includeArchived }
        });
        return response.data;
    },

    // Get project details
    async getProject(projectId: string): Promise<ProjectDetail> {
        const response = await api.get(`/api/v1/projects/${projectId}`);
        return response.data;
    },

    // Update project
    async updateProject(projectId: string, data: UpdateProjectData): Promise<Project> {
        const response = await api.put(`/api/v1/projects/${projectId}`, data);
        return response.data;
    },

    // Archive project
    async archiveProject(projectId: string): Promise<Project> {
        const response = await api.put(`/api/v1/projects/${projectId}/archive`);
        return response.data;
    },

    // Permanently delete project
    async deleteProject(projectId: string): Promise<void> {
        await api.delete(`/api/v1/projects/${projectId}`);
    },

    // Delete dataset
    async deleteDataset(datasetId: string): Promise<void> {
        await api.delete(`/api/v1/datasets/${datasetId}`);
    },

    // Get project summary
    async getProjectSummary(projectId: string): Promise<ProjectDetail> {
        const response = await api.get(`/api/v1/projects/${projectId}/summary`);
        return response.data;
    },
};

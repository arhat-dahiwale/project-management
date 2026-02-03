// frontend/src/projects/projects.api.js

import { apiClient } from "../shared/utils/apiClient.js";

export function getProjects(orgId) {
    return apiClient(`/organizations/${orgId}/projects`,{
        method:"GET",
    });
}

export function getProjectById(orgId, projectId) {
    return apiClient(`/organizations/${orgId}/projects/${projectId}`, {
        method :"GET",
    });
}

export function createProject(orgId,payload) {
    return apiClient(`/organizations/${orgId}/projects`, {
        method:"POST",
        body:JSON.stringify(payload)
    });
}

export function updateProject(orgId, projectId, payload) {
    return apiClient(`/organizations/${orgId}/projects/${projectId}`, {
        method:"PATCH",
        body:JSON.stringify(payload)
    });
}

export function deleteProject(orgId, projectId) {
    return apiClient(`/organizations/${orgId}/projects/${projectId}`, {
        method:"DELETE",
    });
}


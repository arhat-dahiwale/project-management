import { apiClient } from "../shared/utils/apiClient.js";

export function getProjects() {
    return apiClient("/projects",{
        method:"GET",
    });
}

export function getProjectById(projectId) {
    return apiClient(`/projects/${projectId}`, {
        method :"GET",
    });
}

export function createProject(payload) {
    return apiClient("/projects", {
        method:"POST",
        body:JSON.stringify(payload)
    });
}

export function updateProject(projectId, payload) {
    return apiClient(`/projects/${projectId}`, {
        method:"PATCH",
        body:JSON.stringify(payload)
    });
}

export function deleteProject(projectId) {
    return apiClient(`/projects/${projectId}`, {
        method:"DELETE",
    });
}


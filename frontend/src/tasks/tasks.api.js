import { apiClient } from "../shared/utils/apiClient.js";

export function getTasks(projectId) {
    return apiClient(`/projects/${projectId}/tasks`, {
        method:"GET",
    });
}

export function getTaskById(taskId) {
    return apiClient(`/tasks/${taskId}`, {
        method:"GET",
    });
}

export function createTask(projectId, payload) {
    return apiClient(`/projects/${projectId}/tasks`, {
        method:"POST",
        body:JSON.stringify(payload)
    });
}

export function updateTask(taskId,payload) {
    return apiClient(`/tasks/${taskId}`, {
        method:"PATCH",
        body:JSON.stringify(payload)
    });
}

export function deleteTask(taskId) {
    return apiClient(`/tasks/${taskId}`, {
        method:"DELETE",
    });
}


// frontend/src/tasks/tasks.api.js

import { apiClient } from "../shared/utils/apiClient.js";

export async function getTasks(orgId, projectId, { limit, cursor } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set("limit", limit);
  if (cursor) params.set("cursor", cursor);

  const query = params.toString();
  const suffix = query ? `?${query}` : "";

  return apiClient(
    `/organizations/${orgId}/projects/${projectId}/tasks${suffix}`,
    {
      method: "GET",
    }
  );
}


export function createTask(orgId, projectId, payload) {
    return apiClient(`/organizations/${orgId}/projects/${projectId}/tasks`, {
        method:"POST",
        body:JSON.stringify(payload)
    });
}

export function updateTask(orgId, projectId, taskId,payload) {
    return apiClient(`/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`, {
        method:"PATCH",
        body:JSON.stringify(payload)
    });
}

export function deleteTask(orgId, projectId, taskId) {
    return apiClient(`/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`, {
        method:"DELETE",
    });
}


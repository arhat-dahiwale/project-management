// frontend/src/shared/utils/projectStorage.js

const KEY_PREFIX = "active_project_id";

function key(orgId) {
    return `${KEY_PREFIX}:${orgId}`;
}

export function getActiveProjectId(orgId) {
    if (!orgId) return null;
    return localStorage.getItem(key(orgId));
}

export function setActiveProjectId(orgId,projectId) {
    if (!orgId || !projectId) return;
    localStorage.setItem(key(orgId),projectId);
}

export function clearActiveProjectId(orgId) {
    if (!orgId) return;
    localStorage.removeItem(key(orgId));
}
// frontend/src/shared/utils/orgStorage.js

const ACTIVE_ORG_KEY = "active_org_id"

export function getActiveOrgId() {
    return localStorage.getItem(ACTIVE_ORG_KEY);
}

export function setActiveOrgId(orgId) {
    if (!orgId) return;
    localStorage.setItem(ACTIVE_ORG_KEY,orgId);
}

export function clearActiveOrgId() {
    localStorage.removeItem(ACTIVE_ORG_KEY);    
}
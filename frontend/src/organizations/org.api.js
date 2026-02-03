// frontend/src/organizations/org.api.js

import { apiClient } from "../shared/utils/apiClient.js";

export function getOrganizations() {
    return apiClient("/organizations", {
        method:"GET",
    });
}

export function getOrganizationById(orgId) {
    return apiClient(`/organizations/${orgId}`,{
        method:"GET",
    });
    
}

export function createOrganization(payload) {
    return apiClient("/organizations",{
        method:"POST",
        body:JSON.stringify(payload)
    });
}

export function updateOrganization(orgId,payload) {
    return apiClient(`/organizations/${orgId}`,{
        method:"PATCH",
        body:JSON.stringify(payload)
    });
}


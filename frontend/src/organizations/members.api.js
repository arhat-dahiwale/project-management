// frontend/src/organizations/members.api.js

import { apiClient } from "../shared/utils/apiClient";

export function listMembers(orgId) {
  return apiClient(`/organizations/${orgId}/members`, {
    method: "GET",
  });
}

export function addMember(orgId, payload) {
  return apiClient(`/organizations/${orgId}/members`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function removeMember(orgId, userId) {
  return apiClient(`/organizations/${orgId}/members/${userId}`, {
    method: "DELETE",
  });
}

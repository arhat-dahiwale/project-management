import {apiClient} from "../shared/utils/apiClient.js";

export function login(credentials) {
    return apiClient("/auth/login",{
        method:"POST",
        body:JSON.stringify(credentials),
    });
}


export function register(payload) {
    return apiClient("/auth/register", {
        method:"POST",
        body:JSON.stringify(payload),
    });
}

export function getCurrentUser() {
    return apiClient("/auth/me", {
        method:"GET",
    });
}


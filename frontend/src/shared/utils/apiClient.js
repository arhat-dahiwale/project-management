// frontend/src/shared/utils/apiClient.js

import { getToken } from "./storage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let authFailureHandler = null;

export function setAuthFailureHandler(handler) {
    authFailureHandler=handler;
}

export async function apiClient(endpoint, options={}) {
    const token = getToken();

    const headers= {
        ...(options.headers ||  {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`,{
        ...options,
        headers,
    });

    if (response.status===401) {
        if (typeof authFailureHandler === "function") {
            authFailureHandler();
        }

        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        let error;
        try {
            error = await response.json();
        } catch {
            error = { message: "REQUEST_FAILED" };
        }

        throw {
            status: response.status,
            message: error.error || error.message || "REQUEST_FAILED",
        };
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return response.text();    
}


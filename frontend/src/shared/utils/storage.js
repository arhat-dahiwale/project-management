// frontend/src/shared/utils/storage.js

const AUTH_TOKEN_KEY = "pm.auth.token"

export function saveToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY,token);
}

export function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function removeToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}


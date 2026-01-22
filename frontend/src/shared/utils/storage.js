const AUTH_TOKEN_KEY = "pm.auth.token"

export function saveToken(token) {
    localStorage.setItem(AUTH_TOKEN,token);
}

export function getToken() {
    return localStorage.getItem(AUTH_TOKEN);
}

export function removeToken() {
    localStorage.removeItem(AUTH_TOKEN);
}


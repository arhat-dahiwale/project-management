// frontend/src/auth/auth.api.js

import {apiClient} from "../shared/utils/apiClient.js";
import { loginSchema } from "./auth.schemas.js";

export function login(credentials) {
  loginSchema.parse(credentials); // throws early if invalid

  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
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


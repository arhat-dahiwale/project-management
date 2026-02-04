// frontend/src/auth/pages/LoginPage.jsx
import React, { useState } from "react";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../../context/AuthContext";
import * as authApi from "../auth.api";

export function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Get Token
      const { token } = await authApi.login(credentials);
      
      // 2. Temporarily store token so apiClient works for the next call
      localStorage.setItem("pm.auth.token", token); 

      // 3. Fetch User Profile
      const user = await authApi.getCurrentUser();

      // 4. Update Context (this also persists token)
      login({ user, token });
      
    } catch (err) {
      // Clean up if failed
      localStorage.removeItem("pm.auth.token");
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm 
      type="login" 
      onSubmit={handleLogin} 
      isLoading={isLoading} 
      error={error} 
    />
  );
}
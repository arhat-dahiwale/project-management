// frontend/src/auth/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import * as authApi from "../auth.api";

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.register(payload);
      // UX Choice: Redirect to login so they can verify credentials immediately
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Email might be taken.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm 
      type="register" 
      onSubmit={handleRegister} 
      isLoading={isLoading} 
      error={error} 
    />
  );
}
// frontend/src/auth/components/AuthForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { ErrorMessage } from "../../shared/components/ErrorMessage";

export function AuthForm({ type = "login", onSubmit, isLoading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const isLogin = type === "login";
  const title = isLogin ? "Sign in to your account" : "Create your account";
  const buttonText = isLogin ? "Sign In" : "Register";
  const footerText = isLogin ? "Don't have an account?" : "Already have an account?";
  const footerLink = isLogin ? "/register" : "/login";
  const footerLinkText = isLogin ? "Sign up" : "Sign in";

  const containerStyle = {
    maxWidth: "400px",
    margin: "4rem auto",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--gray-200)"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem" }}>
        {title}
      </h2>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit}>
        <Input 
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input 
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <Button 
          type="submit" 
          isLoading={isLoading} 
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {buttonText}
        </Button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--gray-500)" }}>
        {footerText}{" "}
        <Link to={footerLink} style={{ color: "var(--primary-600)", fontWeight: "500" }}>
          {footerLinkText}
        </Link>
      </div>
    </div>
  );
}
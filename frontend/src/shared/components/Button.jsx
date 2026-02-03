// frontend/src/shared/components/Button.jsx
import React from "react";
import { Spinner } from "./Spinner";

export function Button({ 
  children, 
  variant = "primary", // primary, secondary, danger, ghost
  isLoading = false, 
  disabled, 
  className = "", 
  type = "button",
  ...props 
}) {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem 1rem",
    borderRadius: "var(--radius-md)",
    fontWeight: "500",
    fontSize: "0.875rem",
    transition: "all 0.2s",
    opacity: disabled || isLoading ? 0.7 : 1,
    pointerEvents: disabled || isLoading ? "none" : "auto",
    gap: "0.5rem"
  };

  const variants = {
    primary: {
      backgroundColor: "var(--primary-600)",
      color: "white",
    },
    secondary: {
      backgroundColor: "white",
      border: "1px solid var(--gray-300)",
      color: "var(--gray-700)",
    },
    danger: {
      backgroundColor: "var(--danger)",
      color: "white",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--gray-600)",
    }
  };

  const style = { ...baseStyles, ...variants[variant] };

  return (
    <button 
      type={type} 
      disabled={disabled || isLoading} 
      style={style} 
      className={className}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
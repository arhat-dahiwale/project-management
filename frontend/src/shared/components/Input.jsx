// frontend/src/shared/components/Input.jsx
import React, { forwardRef } from "react";

export const Input = forwardRef(({ 
  label, 
  error, 
  type = "text", 
  ...props 
}, ref) => {
  
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    marginBottom: "1rem",
    width: "100%"
  };

  const labelStyle = {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "var(--gray-700)"
  };

  const inputStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "var(--radius-md)",
    border: `1px solid ${error ? "var(--danger)" : "var(--gray-300)"}`,
    fontSize: "0.875rem",
    width: "100%",
    transition: "border-color 0.2s"
  };

  const errorStyle = {
    fontSize: "0.75rem",
    color: "var(--danger)"
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input 
        ref={ref} 
        type={type} 
        style={inputStyle} 
        {...props} 
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
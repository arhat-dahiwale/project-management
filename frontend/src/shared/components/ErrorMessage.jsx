// frontend/src/shared/components/ErrorMessage.jsx
import React from 'react';

export function ErrorMessage({ message }) {
  if (!message) return null;

  const style = {
    padding: "0.75rem",
    backgroundColor: "var(--danger-bg)",
    color: "var(--danger)",
    borderRadius: "var(--radius-md)",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    border: "1px solid var(--danger)"
  };

  return (
    <div style={style} role="alert">
      {typeof message === 'string' ? message : "An unknown error occurred"}
    </div>
  );
}
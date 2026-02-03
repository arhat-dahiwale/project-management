// frontend/src/shared/components/Spinner.jsx
import React from 'react';

export function Spinner({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "16px",
    md: "24px",
    lg: "32px"
  };

  const style = {
    width: sizeMap[size],
    height: sizeMap[size],
    border: "2px solid var(--gray-200)",
    borderTopColor: "var(--primary-600)",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
    display: "inline-block"
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={style} className={className} aria-label="Loading..." />
    </>
  );
}
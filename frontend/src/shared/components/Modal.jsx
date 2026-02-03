// frontend/src/shared/components/Modal.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  width = "500px" 
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  
  const overlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)"
  };

  const modalStyle = {
    backgroundColor: "white",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    width: width,
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    animation: "slideIn 0.2s ease-out"
  };

  const headerStyle = {
    padding: "1rem 1.5rem",
    borderBottom: "1px solid var(--gray-200)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const bodyStyle = {
    padding: "1.5rem",
    overflowY: "auto"
  };

  const footerStyle = {
    padding: "1rem 1.5rem",
    borderTop: "1px solid var(--gray-200)",
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    backgroundColor: "var(--gray-50)",
    borderBottomLeftRadius: "var(--radius-lg)",
    borderBottomRightRadius: "var(--radius-lg)"
  };

  return createPortal(
    <div style={overlayStyle} onClick={onClose}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>{title}</h3>
          <Button variant="ghost" onClick={onClose} style={{ padding: "0.25rem" }}>
            ✕
          </Button>
        </div>
        
        <div style={bodyStyle}>
          {children}
        </div>

        {footer && (
          <div style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
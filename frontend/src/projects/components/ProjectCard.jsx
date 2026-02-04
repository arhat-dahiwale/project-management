// frontend/src/projects/components/ProjectCard.jsx
import React, { useState } from "react";
import { Button } from "../../shared/components/Button";

export function ProjectCard({ project, onClick, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project?")) return;
    
    setIsDeleting(true);
    await onDelete(project.id);
    setIsDeleting(false);
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "var(--radius-lg)",
    border: `1px solid ${isHovered ? "var(--primary-200)" : "var(--gray-200)"}`,
    padding: "1.5rem",
    boxShadow: isHovered ? "var(--shadow-md)" : "var(--shadow-sm)",
    transition: "all 0.2s",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "180px",
    transform: isHovered ? "translateY(-2px)" : "none"
  };

  return (
    <div 
      style={cardStyle}
      onClick={() => onClick(project.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--primary-700)" }}>
          {project.name}
        </h3>
        <div style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
          Created {new Date(project.created_at).toLocaleDateString()}
        </div>
      </div>

      {isHovered && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            isLoading={isDeleting}
            style={{ color: "var(--danger)", fontSize: "0.8rem" }}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
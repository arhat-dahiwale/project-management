// frontend/src/projects/components/ProjectCard.jsx
import React, { useState } from "react";
import { Button } from "../../shared/components/Button";
import { Modal } from "../../shared/components/Modal";
import { ErrorMessage } from "../../shared/components/ErrorMessage";

export function ProjectCard({ project, onClick, onDelete, onEdit }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(project.id);
      setShowConfirm(false);
    } catch (err) {
      setError("You don’t have permission to delete this project.");
    } finally {
      setIsDeleting(false);
    }
  }

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
    height: "140px",
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
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
          >
            ✎
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
          >
            Delete
          </Button>
        </div>
      )}

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Delete Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </>
        }
      >
        <ErrorMessage message={error} />
        <p>
          Are you sure you want to permanently delete{" "}
          <strong>{project.name}</strong>? This action cannot be undone.
        </p>
      </Modal>

    </div>
  );
}
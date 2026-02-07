// frontend/src/projects/components/ProjectList.jsx
import React from "react";
import { ProjectCard } from "./ProjectCard";
import { Button } from "../../shared/components/Button";

export function ProjectList({ projects, onOpenProject, onDeleteProject,onEditProject, onCreateClick }) {
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem"
  };

  const emptyStyle = {
    backgroundColor: "var(--gray-50)",
    border: "2px dashed var(--gray-300)",
    borderRadius: "var(--radius-lg)",
    padding: "3rem",
    textAlign: "center",
    color: "var(--gray-500)"
  };

  if (projects.length === 0) {
    return (
      <div style={emptyStyle}>
        <p style={{ marginBottom: "1rem" }}>No projects found in this organization.</p>
        <Button variant="secondary" onClick={onCreateClick}>
          Create Project
        </Button>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onClick={onOpenProject} 
          onDelete={onDeleteProject}
          onEdit={onEditProject}
        />
      ))}
    </div>
  );
}
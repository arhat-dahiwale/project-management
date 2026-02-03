// frontend/src/projects/pages/ProjectsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import { useOrgContext } from "../../context/OrgContext";
import { Button } from "../../shared/components/Button";
import { Modal } from "../../shared/components/Modal";
import { Input } from "../../shared/components/Input";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import { Spinner } from "../../shared/components/Spinner";

export function ProjectsPage() {
  const navigate = useNavigate();
  const { activeOrg } = useOrgContext();
  const { projects, createProject, deleteProject, setActiveProject, isLoading: projectsLoading } = useProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const project = await createProject({ name: newProjectName });
      setIsModalOpen(false);
      setNewProjectName("");
      // Optional: Navigate immediately to the new project
      navigate(`/projects/${project.id}`);
    } catch (err) {
      setCreateError(err.message || "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation(); // Don't navigate to details
    if (!window.confirm("Are you sure? This will delete all tasks in the project.")) return;

    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
    } catch (err) {
      alert("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  
  const pageHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem"
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--gray-200)",
    padding: "1.5rem",
    boxShadow: "var(--shadow-sm)",
    transition: "all 0.2s",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "180px"
  };

  const deleteBtnStyle = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    opacity: 0, 
    transition: "opacity 0.2s"
  };

  if (projectsLoading && projects.length === 0) {
    return <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}><Spinner /></div>;
  }

  return (
    <div>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "var(--gray-900)" }}>
            Projects
          </h1>
          <p style={{ color: "var(--gray-500)", marginTop: "0.5rem" }}>
            {activeOrg ? `Projects in ${activeOrg.name}` : "Select an organization"}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={!activeOrg}>
          + New Project
        </Button>
      </div>

      <div style={gridStyle}>
        {projects.map((p) => (
          <div 
            key={p.id} 
            style={cardStyle}
            onClick={() => {
              setActiveProject(p.id);
              navigate(`/projects/${p.id}`);
            }}
            className="project-card" // Using class for hover effect on button
          >
             
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--primary-700)" }}>
                {p.name}
              </h3>
              <div style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                Created {new Date(p.created_at).toLocaleDateString()}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
               {/* Stop propagation*/}
               <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => handleDelete(e, p.id)}
                  isLoading={deletingId === p.id}
                  style={{ color: "var(--danger)", fontSize: "0.8rem" }}
               >
                 Delete
               </Button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div style={{ ...cardStyle, height: "auto", textAlign: "center", borderStyle: "dashed", backgroundColor: "var(--gray-50)", cursor: "default", padding: "3rem" }}>
            <p style={{ color: "var(--gray-500)", marginBottom: "1rem" }}>No projects found.</p>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)} disabled={!activeOrg}>
              Create Project
            </Button>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isCreating}>Create Project</Button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <ErrorMessage message={createError} />
          <Input
            label="Project Name"
            placeholder="Website Redesign, Q1 Marketing..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            autoFocus
          />
        </form>
      </Modal>
    </div>
  );
}
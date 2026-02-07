// frontend/src/projects/pages/ProjectsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import { useOrgContext } from "../../context/OrgContext";
import { ProjectList } from "../components/ProjectList";
import { Button } from "../../shared/components/Button";
import { Modal } from "../../shared/components/Modal";
import { Input } from "../../shared/components/Input";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import { Spinner } from "../../shared/components/Spinner";
import { MembersPanel } from "../../organizations/components/MembersPanel";


export function ProjectsPage() {
  const navigate = useNavigate();
  const { activeOrg } = useOrgContext();
  const { projects, createProject,updateProject, deleteProject, setActiveProject, isLoading } = useProject();

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editProjectName, setEditProjectName] = useState("");


  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const project = await createProject({ name: newProjectName });
      setIsModalOpen(false);
      setNewProjectName("");
      navigate(`/organizations/${activeOrg.id}/projects/${project.id}`);
    } catch (err) {
      setCreateError("You don’t have permission to create projects in this organization.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenProject = (projectId) => {
    setActiveProject(projectId);
    navigate(`/organizations/${activeOrg.id}/projects/${projectId}`);
  };

  if (isLoading && projects.length === 0) {
    return <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}><Spinner /></div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Projects</h1>
          <p style={{ color: "var(--gray-500)", marginTop: "0.5rem" }}>
            {activeOrg ? `Workspace: ${activeOrg.name}` : "Select an organization"}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={!activeOrg}>
          + New Project
        </Button>
      </div>

      {activeOrg && <MembersPanel orgId={activeOrg.id} />}


      <ProjectList 
        projects={projects}
        onOpenProject={handleOpenProject}
        onDeleteProject={deleteProject}
        onEditProject={(project) => {
          if (activeOrg.role !== "admin") {
            setShowPermissionModal(true);
            return;
          }

          setEditingProject(project);
          setEditProjectName(project.name);
          setIsEditModalOpen(true);
        }}
        onCreateClick={() => setIsModalOpen(true)}
      />

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
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            autoFocus
          />
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await updateProject(editingProject.id, {
                  name: editProjectName,
                });
                setIsEditModalOpen(false);
              }}
              disabled={!editingProject}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <Input
          label="Project Name"
          value={editProjectName}
          onChange={(e) => setEditProjectName(e.target.value)}
          autoFocus
        />
      </Modal>

      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title="Permission Required"
        footer={
          <Button onClick={() => setShowPermissionModal(false)}>
            OK
          </Button>
        }
      >
        <p>
          You don’t have permission to edit projects in this organization.
          Please contact an administrator if you need access.
        </p>
      </Modal>

    </div>
  );
}
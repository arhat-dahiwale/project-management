// frontend/src/projects/pages/ProjectDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTasks } from "../../tasks/hooks/useTasks";
import { useOrgContext } from "../../context/OrgContext";
import { useProjectContext } from "../../context/projectContext"; 
import { TaskList } from "../../tasks/components/TaskList";
import { Button } from "../../shared/components/Button";
import { Modal } from "../../shared/components/Modal";
import { Input } from "../../shared/components/Input";
import { Spinner } from "../../shared/components/Spinner";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import * as projectsApi from "../projects.api";


export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { activeOrg } = useOrgContext();
  const { projects } = useProjectContext();

  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState(null);

  const currentProject = project;
  
  const { 
    tasks, 
    isLoading, 
    error: taskError, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useTasks(project ? activeOrg?.id : null, project ? projectId:null );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      await createTask({ 
        title: newTaskTitle, 
        description: newTaskDesc 
      });
      setIsModalOpen(false);
      setNewTaskTitle("");
      setNewTaskDesc("");
    } catch (err) {
      alert("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const pageContainerStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexShrink: 0
  };

  const boardStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem",
    flex: 1,
    overflowX: "auto",
    paddingBottom: "1rem"
  };

  useEffect(() => {
    async function resolveProject() {
      if (!activeOrg?.id || !projectId) return;

      const fromContext = projects.find(p => p.id === projectId);
      if (fromContext) {
        setProject(fromContext);
        setProjectLoading(false);
        return;
      }

      try {
        setProjectError(null);
        setProjectLoading(true);
        const fetched = await projectsApi.getProjectById(
          activeOrg.id,
          projectId
        );
        setProject(fetched);
      } catch (err) {
        setProjectError(err);
      } finally {
        setProjectLoading(false);
      }
    }

    resolveProject();
  }, [activeOrg, projectId, projects]);


  if (!activeOrg) return <div>Select an Organization</div>;
  if (projectLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Spinner />
      </div>
    );
  }

  if (projectError) {
    return (
      <div style={{ padding: "2rem" }}>
        <ErrorMessage message="Project not found or inaccessible." />
      </div>
    );
  }


  return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--gray-900)" }}>
            {currentProject ? currentProject.name : "Project Board"}
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: "0.875rem" }}>
            {tasks.length} tasks
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          + New Task
        </Button>
      </div>

      <ErrorMessage message={taskError?.message} />

      <div style={boardStyle}>
        <TaskList 
          title="To Do" 
          status="todo" 
          tasks={tasks} 
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
        <TaskList 
          title="In Progress" 
          status="in_progress" 
          tasks={tasks} 
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
        <TaskList 
          title="Done" 
          status="done" 
          tasks={tasks} 
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isCreating}>Create Task</Button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <Input
            label="Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
            required
          />
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "var(--gray-700)", marginBottom: "0.25rem" }}>
              Description
            </label>
            <textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--gray-300)",
                fontFamily: "inherit",
                fontSize: "0.875rem"
              }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
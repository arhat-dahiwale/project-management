// frontend/src/projects/hooks/useProject.js

import { useState, useCallback } from "react";
import { useOrgContext } from "../../context/OrgContext";
import { useProjectContext } from "../../context/projectContext";
import * as projectsApi from "../projects.api";


export function useProject() {
    const { activeOrg } = useOrgContext();
    const { 
    projects, 
    activeProject, 
    setActiveProject, 
    refreshProjects 
  } = useProjectContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const requireOrg = () => {
    if (!activeOrg?.id) throw new Error("No active organization selected");
    return activeOrg.id;
  };

  const createProject = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    const orgId = requireOrg();

    try {
        const newProject = await projectsApi.createProject(orgId, payload);
        await refreshProjects();
        setActiveProject(newProject.id);
        return newProject;
    } catch (err) {
        setError(err);
        throw err;
    } finally {
        setIsLoading(false);
    }
  }, [activeOrg, refreshProjects, setActiveProject]);

  const updateProject = useCallback(async (projectId, payload) => {
    setIsLoading(true);
    setError(null);
    const orgId = requireOrg();

    try {
      const updated = await projectsApi.updateProject(orgId, projectId, payload);
      await refreshProjects();
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeOrg, refreshProjects]);

  const deleteProject = useCallback(async (projectId) => {
    setIsLoading(true);
    setError(null);
    const orgId = requireOrg();

    try {
      await projectsApi.deleteProject(orgId, projectId);
      await refreshProjects();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeOrg, refreshProjects]);

  return {
    // Data
    projects,
    activeProject,

    // Actions
    createProject,
    updateProject,
    deleteProject,
    setActiveProject,

    // Status
    isLoading,
    error
  };
}
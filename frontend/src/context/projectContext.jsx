import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { useAuth } from "./AuthContext";
import { useOrgContext } from "./OrgContext";

import * as projectsApi from "../projects/projects.api";

import {
  getActiveProjectId,
  setActiveProjectId,
  clearActiveProjectId,
} from "../shared/utils/projectStorage";

const ProjectContext = createContext(undefined);

export function ProjectProvider({children}) {
    const {status : authStatus} = useAuth();
    const { activeOrg } = useOrgContext();

    const [status, setStatus] = useState("idle");
    const [projects, setProjects] = useState([]);
    const [activeProject, setActiveProjectState] = useState(null);

    const reset = useCallback(() => {
        setStatus("idle");
        setProjects([]);
        setActiveProjectState(null);
        if (activeOrg?.id) {
        clearActiveProjectId(activeOrg.id);
        }
    }, [activeOrg]);

    const resolveActiveProject = useCallback((fetchedProjects) => {
        const orgId = activeOrg.id;
        const persistedId = getActiveProjectId(orgId);

        let resolved = null;

        if (persistedId) {
            resolved =
            fetchedProjects.find((p) => p.id === persistedId) || null;
        }

        if (!resolved) {
            resolved = fetchedProjects[0] || null;
        }

        if (!resolved) {
            setStatus("empty");
            setActiveProjectState(null);
            clearActiveProjectId(orgId);
            return;
        }

        setActiveProjectState(resolved);
        setActiveProjectId(orgId, resolved.id);
        setStatus("ready");
        },
        [activeOrg]
    );

    const bootstrap = useCallback(async () => {
        if (!activeOrg?.id) return;

        setStatus("loading");

        try {
        const fetchedProjects = await projectsApi.getProjects(activeOrg.id);

        setProjects(fetchedProjects);

        if (fetchedProjects.length === 0) {
            setStatus("empty");
            setActiveProjectState(null);
            clearActiveProjectId(activeOrg.id);
            return;
        }

        resolveActiveProject(fetchedProjects);
        } catch (err) {
        console.error("project bootstrap failed:", err);
        setStatus("error");
        }
    }, [activeOrg, resolveActiveProject]);

    useEffect(() => {
        if (authStatus === "authenticated" && activeOrg?.id) {
        bootstrap();
        } else {
        reset();
        }
    }, [authStatus, activeOrg, bootstrap, reset]);

    const setActiveProject = useCallback(
        (projectId) => {
        const project = projects.find((p) => p.id === projectId);
        if (!project || !activeOrg?.id) return;

        setActiveProjectState(project);
        setActiveProjectId(activeOrg.id, project.id);
        },
        [projects, activeOrg]
    );

    const refreshProjects = useCallback(async () => {
        if (authStatus !== "authenticated" || !activeOrg?.id) return;
        await bootstrap();
    }, [authStatus, activeOrg, bootstrap]);

    const value = {
        status,
        projects,
        activeProject,
        setActiveProject,
        refreshProjects,
    };

    return (
        <ProjectContext.Provider value={value}>
        {children}
        </ProjectContext.Provider>
    );
}


export function useProjectContext() {
    const ctx = useContext(ProjectContext);
    if (!ctx) {
        throw new Error("useProjectContext must be used within ProjectProvider");
    }
    return ctx;
}
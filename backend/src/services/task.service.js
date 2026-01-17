// task.service.js
import { createTask, listTasksByProject,updateTask,deleteTask } from "../repositories/task.repository.js";
import { requireOrgRole } from "./authorization.service.js";
import { getProjectById } from "../repositories/project.repository.js";


// returns all the tasks in a project and if there are none then it returns []
export async function listProjectTasks(userId, orgId, projectId,{limit,cursor}) {
    await requireOrgRole(userId,orgId,["admin","member"]);

    const project = await getProjectById(projectId);
    if (!project || project.organization_id!=orgId) {
        throw { code: "PROJECT_NOT_FOUND" };
    }

    const tasks = await listTasksByProject(projectId,{limit, cursor});
    const nextCursor = tasks.length === limit ? tasks[tasks.length-1].created_at : null;
    return {
        data : tasks,
        nextCursor
    }
}

// returns created task if successful else returns []
export async function createProjectTask(userId,orgId,projectId,title,description) {
    await requireOrgRole(userId,orgId,["admin","member"]);
    const status = "todo";

    const project = await getProjectById(projectId);
    if (!project || project.organization_id!=orgId) {
        throw { code: "PROJECT_NOT_FOUND" };
    }

    return createTask(projectId,title,description,status);
}


/**
 * Updates a task in a project.
 *
 * Contract:
 * - Requires user to be admin or member of org.
 * - Returns updated task if successful.
 * - Throws TASK_NOT_FOUND if task does not exist in project.
 * - Throws NOT_A_MEMBER / INSUFFICIENT_ROLE on auth failure.
 */
export async function updateProjectTask(userId,orgId,projectId,taskId,title,description,status) {
    await requireOrgRole(userId,orgId,["admin","member"]);

    if (typeof title !== "string" || typeof description !== "string" || typeof status !== "string") {
        throw { code: "INVALID_TASK_UPDATE" };
    }

    const project = await getProjectById(projectId);
    if (!project || project.organization_id!=orgId) {
        throw { code: "PROJECT_NOT_FOUND" };
    }

    const ALLOWED_STATUSES = ["todo", "in_progress", "done"];

    if (!ALLOWED_STATUSES.includes(status)) {
        throw { code: "INVALID_TASK_UPDATE" };
    }


    const updatedTask = await updateTask(projectId,taskId,title,description,status);

    if (!updatedTask) {
        throw { code: "TASK_NOT_FOUND" };
    }
    
    return updatedTask;
}

// resolves successfully if deleted, throws if not found
export async function deleteProjectTask(userId,orgId,projectId,taskId) {
    await requireOrgRole(userId,orgId,["admin"]);

    const project = await getProjectById(projectId);
    if (!project || project.organization_id!=orgId) {
        throw { code: "PROJECT_NOT_FOUND" };
    }

    const isTaskDeleted =  await deleteTask(projectId,taskId);

    if (!isTaskDeleted) {
        throw { code: "TASK_NOT_FOUND" };
    }

    return undefined;
}


// backend/src/services/task.service.js
import { createTask, listTasksByProject,updateTask,deleteTask, getTaskById } from "../repositories/task.repository.js";
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

    

    const project = await getProjectById(projectId);
    if (!project || project.organization_id!=orgId) {
        throw { code: "PROJECT_NOT_FOUND" };
    }

    if (title !== undefined && typeof title !== "string") {
        throw { code: "INVALID_TASK_UPDATE" };
    }
    if (description !== undefined && description !== null && typeof description !== "string") {
        throw { code: "INVALID_TASK_UPDATE" };
    }
    if (status !== undefined && typeof status !== "string") {
        throw { code: "INVALID_TASK_UPDATE" };
    }

    const ALLOWED_STATUSES = ["todo", "in_progress", "done"];
    if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
        throw { code: "INVALID_TASK_UPDATE" };
    }

    const existingTask = await getTaskById(projectId, taskId);
    if (!existingTask) {
        throw { code: "TASK_NOT_FOUND" };
    }
    const finalTitle = title !== undefined ? title : existingTask.title;
    const finalDescription = description !== undefined ? description : existingTask.description;
    const finalStatus = status !== undefined ? status : existingTask.status;


    const updatedTask = await updateTask(projectId, taskId, finalTitle, finalDescription, finalStatus);

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


// task.service.js
import { createTask, listTasksByProject,updateTask,deleteTask } from "../repositories/task.repository.js";
import { requireOrgRole } from "./authorization.service.js";


// returns all the tasks in a project and if there are none then it returns []
export async function listProjectTasks(userId, orgId, projectId) {
    await requireOrgRole(userId,orgId,["admin","member"]);

    return listTasksByProject(projectId);
}

// returns created task if successful else returns []
export async function createProjectTask(userId,orgId,projectId,title,description) {
    await requireOrgRole(userId,orgId,["admin","member"]);
    const status = "todo";

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

    const updatedTask = await updateTask(projectId,taskId,title,description,status);

    if (!updatedTask) {
        throw { code: "TASK_NOT_FOUND" };
    }
    
    return updatedTask;
}

// returns nothing if deleted successfully else throws task not found error
export async function deleteProjectTask(userId,orgId,projectId,taskId) {
    await requireOrgRole(userId,orgId,["admin"]);

    const isTaskDeleted =  await deleteTask(projectId,taskId);

    if (!isTaskDeleted) {
        throw { code: "TASK_NOT_FOUND" };
    }

    return undefined;
}


// let us NOT focus on documentation right now
// let us get things running, only after entire project is ready will I move to docs
// no wasting time writing, only coding
// 

// backend/src/constrollers/task.controller.js
import { createProjectTask,deleteProjectTask,updateProjectTask,listProjectTasks } from "../services/task.service.js";

export async function getTasks(req,res) {
    const userId = req.user.id;
    const {orgId,projectId} = req.params;

    
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20,100);
        const cursor = req.query.cursor || null;
        const tasks = await listProjectTasks(userId,orgId,projectId, {limit,cursor});
        


        return res.json(tasks);
    } catch (err) {
        
        if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
            return res.status(403).json({ error: err.code });
        }
        if (err?.code === "INVALID_TASK_UPDATE") {
            return res.status(400).json({ error: err.code });
        }
        if (err?.code === "PROJECT_NOT_FOUND") {
            return res.status(404).json({ error: err.code });
        }



        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export async function createTask(req,res) {
    const userId = req.user.id;
    const {orgId,projectId} = req.params;
    const {title,description} = req.body;

    if (!title || typeof title !== "string") {
        return res.status(400).json({error:"INVALID_TASK_INPUT"});
    }

    try {
        const task = await createProjectTask(userId,orgId,projectId,title,description ?? null);
        return res.status(201).json(task);
    } catch (err) {
        if (err?.code === "TASK_NOT_FOUND") {
            return res.status(404).json({error:err.code});
        }
        if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
            return res.status(403).json({ error: err.code });
        }
        if (err?.code === "PROJECT_NOT_FOUND") {
            return res.status(404).json({ error: err.code });
        }

        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export async function updateTask(req,res) {
    const userId = req.user.id;
    const {orgId,projectId,taskId} = req.params;
    const {title,description,status} = req.body;

    if (
        (title !== undefined && typeof title !== "string") ||
        (description !== undefined && description !== null && typeof description !== "string") ||
        (status !== undefined && typeof status !== "string")
    ) {
        return res.status(400).json({ error: "INVALID_TASK_UPDATE" });
    }


    try {
        const task = await updateProjectTask(userId,orgId,projectId,taskId,title,description,status);
        return res.json(task);
    } catch (err) {
        if (err?.code === "TASK_NOT_FOUND") {
            return res.status(404).json({error:err.code});
        }
        if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
            return res.status(403).json({ error: err.code });
        }
        if (err?.code === "PROJECT_NOT_FOUND") {
            return res.status(404).json({ error: err.code });
        }

        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export async function removeTask(req,res) {
    const userId = req.user.id;
    const {orgId,projectId,taskId} = req.params;

    try {
        await deleteProjectTask(userId,orgId,projectId,taskId);
        return res.status(204).end();
    } catch (err) {
        if (err?.code === "TASK_NOT_FOUND") {
            return res.status(404).json({error:err.code});
        }
        if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
            return res.status(403).json({ error: err.code });
        }
        if (err?.code === "PROJECT_NOT_FOUND") {
            return res.status(404).json({ error: err.code });
        }

        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}
// task.controller.js
import { createProjectTask,deleteProjectTask,updateProjectTask,listProjectTasks } from "../services/task.service.js";

export async function getTasks(req,res) {
    const userId = req.user.id;
    const {orgId,projectId} = req.params;
    try {
        const limit = Math.min(parseInt(req.params.limit) || 20,100);
        const offset = parseInt(req.params.offset) || 0;
        const tasks = await listProjectTasks(userId,orgId,projectId, {limit,offset});

        return res.json(tasks);
    } catch (err) {
        if (err?.code === "TASK_NOT_FOUND") {
            return res.status(404).json({error:err.code});
        }
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

    if (!title || !description) {
        return res.status(400).json({error:"Enter required fields"});
    }

    try {
        const task = await createProjectTask(userId,orgId,projectId,title,description);
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

export async function updateTask(req,res) {
    const userId = req.user.id;
    const {orgId,projectId,taskId} = req.params;
    const {title,description,status} = req.body;

    if (!title || !description || !status) {
        return res.status(400).json({error:"Enter required fields"});
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
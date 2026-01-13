import { createProjectTask,deleteProjectTask,updateProjectTask,listProjectTasks } from "../services/task.service.js";

export async function getTasks(req,res) {
    const userId = req.user.id;
    const {orgId,projectId} = req.params;

    try {
        const tasks = await listProjectTasks(userId,orgId,projectId);
        res.json(tasks);
    } catch (err) {
        res.status(403).json(err);
    }
}

export async function createTask(req,res) {
    const userId = req.user.id;
    const {orgId,projectId} = req.params;
    const {title,description,status} = req.body;

    if (!title || !description) {
        return res.status(400).json({error:"Enter required fields"});
    }

    try {
        const task = await createProjectTask(userId,orgId,projectId,title,description);
        res.json(task);
    } catch (err) {
        res.status(403).json(err);
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
        res.json(task);
    } catch (err) {
        res.status(403).json(err);
    }
}

export async function removeTask(req,res) {
    const userId = req.user.id;
    const {orgId,projectId,taskId} = req.params;

    try {
        await deleteProjectTask(userId,orgId,projectId,taskId);
        res.json({success:true});
    } catch (err) {
        res.status(403).json({error:"User not authorized"});
    }
}
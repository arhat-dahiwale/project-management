// project.controller.js

import { createOrgProject, listOrgProjects } from "../services/project.service.js";

export async function createProject(req,res) {
    const userId = req.user.id;
    const {orgId} = req.params;
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({error:"project name required"});
    }

    try {
        const project = await createOrgProject(userId,orgId,name);
        return res.status(201).json(project);
    } catch (err) {
        if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
            return res.status(403).json({ error: err.code });
        }

        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}


export async function listProjects(req,res) {
    const userId = req.user.id;
    const {orgId} = req.params;
    
    try {
        const projects = await listOrgProjects(userId,orgId);
        return res.json(projects);
    } catch (err) {
        
        if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
            return res.status(403).json({ error: err.code });
        }

        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}
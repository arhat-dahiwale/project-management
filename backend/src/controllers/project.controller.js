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
        res.json(project);
    } catch (err) {
        res.status(403).json({error:"Not authorized"});
    }
}


export async function listProjects(req,res) {
    const userId = req.user.id;
    const {orgId} = req.params;
    
    try {
        const projects = listOrgProjects(userId,orgId);
        res.json(projects);
    } catch (err) {
        res.status(403).json({error:"Not Authorized"});
    }
}
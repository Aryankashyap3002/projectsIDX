import { projectService, projectTreeService } from "../service/projectService.js";

export async function projectController(req, res) {
    try {
        const projectId = await projectService();
        return res.status(201).json({
            msg: "Project created successfully",
            data: projectId,
        });
    } catch (err) {
        console.error("Error creating project:", err);
        return res.status(500).json({ error: "Project creation failed" });
    }
}

export async function projectTreeController(req, res) {
    try {
        const projectPath = await projectTreeService(req.params.projectId);
        return res.status(201).json({
            msg: "Fetched project path",
            data: projectPath,
        });
    } catch (err) {
        console.error("Error creating project:", err);
        return res.status(500).json({ error: "Can't fetch projectTree" });
    }
}
                     
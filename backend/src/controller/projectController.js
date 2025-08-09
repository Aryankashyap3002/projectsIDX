import { projectService, projectTreeService, getAllProjectService } from "../service/projectService.js";

export async function projectController(req, res) {
    try {
        console.log("projectName: ",req.body.name);
        const projectId = await projectService(req.body.name);
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

export async function getAllProjectController(req, res) {
    try {
       const projects = await getAllProjectService();
       console.log("Projects before response:", projects);
       return res.status(200).json({
        msg: "Successfully fetched all projects",
        data: projects
       });
    } catch (error) {
        console.log("Error while fetching projects", error);
        return res.status(500).json({
            error: "Projects fetching get failed"
        });
    }
}
                     
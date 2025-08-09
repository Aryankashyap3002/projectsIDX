import { v4 as uuid4 } from 'uuid';
import fs from 'fs/promises'
import { REACT_PROJECT_COMMAND } from '../config/serverConfig.js';
import { execPromisified } from '../utils/projectUtil.js';
import { walkDirectory } from '../utils/projectTreeUtil.js';

export async function projectService (name) {
    const projectId = uuid4();
    console.log("Name of Project is: ", name);
    await fs.mkdir(`./projects/${projectId}`);
    console.log("project Id ", projectId);
    const sanitizedName = name.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    if (!sanitizedName) {
        throw new Error('Project name is invalid or empty');
    }
    await execPromisified(`npm create vite@latest ${sanitizedName} -- --template react --yes`, {
        cwd: `./projects/${projectId}`
    });

    return projectId;
}

export async function projectTreeService(projectId) {
    const projectPath = `./projects/${projectId}`;
    const projectTreePath = walkDirectory(projectPath);
    return projectTreePath;
} 

export async function getAllProjectService() {
    const projectPath = `./projects/`;
    const projects = await fs.readdir(projectPath, {withFileType: true}, (err, dirents) => {
        if(err) {
            console.error('Error reading directory:', err);
            return;
        }

        const folders = dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

        console.log("projects are :", folders);
        return folders;
    });
    console.log("Projects are :", projects);
    return projects;
}
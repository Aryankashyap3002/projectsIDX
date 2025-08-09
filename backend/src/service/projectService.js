import { v4 as uuid4 } from 'uuid';
import fs from 'fs/promises'
import { execPromisified } from '../utils/projectUtil.js';
import { walkDirectory } from '../utils/projectTreeUtil.js';
import path from 'path';

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
    const projectPath = './projects/';
    
    try {
        const projectIds = await fs.readdir(projectPath, { withFileTypes: true });
        const projectFolders = projectIds.filter(dirent => dirent.isDirectory());
        
        // Use Promise.all for parallel processing
        const projectNames = await Promise.all(
            projectFolders.map(async (projectFolder) => {
                try {
                    const subDirPath = path.join(projectPath, projectFolder.name);
                    const subDirs = await fs.readdir(subDirPath, { withFileTypes: true });
                    const subFolder = subDirs.find(dirent => dirent.isDirectory());
                    return subFolder ? subFolder.name : null;
                } catch (error) {
                    console.error(`Error reading ${projectFolder.name}:`, error);
                    return null;
                }
            })
        );
        
        // Filter out null values
        const validProjectNames = projectNames.filter(name => name !== null);
        console.log('Valid project names:', validProjectNames);
        return validProjectNames;
        
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
}
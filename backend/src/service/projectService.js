import { v4 as uuid4 } from 'uuid';
import fs from 'fs/promises'
import { execPromisified } from '../utils/projectUtil.js';
import { walkDirectory } from '../utils/projectTreeUtil.js';
import path from 'path';

export async function projectService ({name, type}) {
    const projectId = uuid4();
    console.log("Name of Project is: ", name);
    await fs.mkdir(`./projects/${projectId}`);
    console.log("project Id ", projectId);
    const sanitizedName = name.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    if (!sanitizedName) {
        throw new Error('Project name is invalid or empty');
    }
    if(type == 'react') {
        await execPromisified(`npm create vite@latest ${sanitizedName} -- --template react --yes`, {
            cwd: `./projects/${projectId}`
        });
    } else if(type == 'next') {
        await execPromisified(`npx create-next-app@latest ${sanitizedName} --js --yes`, {
            cwd: `./projects/${projectId}`
        });
    }
    

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
        
        const projects = await Promise.all(
            projectFolders.map(async (projectFolder) => {
                try {
                    const subDirPath = path.join(projectPath, projectFolder.name);
                    const subDirs = await fs.readdir(subDirPath, { withFileTypes: true });
                    const subFolder = subDirs.find(dirent => dirent.isDirectory());
                    
                    if (subFolder) {
                        return {
                            id: projectFolder.name,   
                            name: subFolder.name      
                        };
                    }
                    return null;
                } catch (error) {
                    console.error(`Error reading ${projectFolder.name}:`, error);
                    return null;
                }
            })
        );
        
        const validProjects = projects.filter(project => project !== null);
        console.log('Valid projects:', validProjects);
        return validProjects;
        
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
}
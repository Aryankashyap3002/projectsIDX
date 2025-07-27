import { v4 as uuid4 } from 'uuid';
import fs from 'fs/promises'
import { REACT_PROJECT_COMMAND } from '../config/serverConfig.js';
import { execPromisified } from '../utils/projectUtil.js';
import path from 'path';
import { walkDirectory } from '../utils/projectTreeUtil.js';

export async function projectService () {
    const projectId = uuid4();
    await fs.mkdir(`./projects/${projectId}`);
    console.log("project Id ", projectId);

    await execPromisified(REACT_PROJECT_COMMAND, {
        cwd: `./projects/${projectId}`
    });

    return projectId;
}

export async function projectTreeService(projectId) {
    const projectPath = `./projects/${projectId}`;
    const projectTreePath = walkDirectory(projectPath);
    return projectTreePath;
} 
import fs from 'fs/promises';
import path from 'path';

class File {
    path='';
    name='';
    constructor (path, name) {
        this.path = path;
        this.name = name;
    }
}

class Directory {
    path='';
    name='';
    children = [];
    constructor (path, name) {
        this.path =  path;
        this.name = name;
    }

    addChild(Child) {
        this.children.push(Child);
    }
}

export async function walkDirectory(directoryPath) {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const rootDir = new Directory(directoryPath, path.basename(directoryPath));
    

    for(let entry of entries) {
        const entryPath = path.join(directoryPath, entry.name);

        if(entry.isDirectory()) {
            const subDir = await walkDirectory(entryPath);
            rootDir.addChild(subDir);
        } else if(entry.isFile()) {
            const newFile = new File(entryPath, entry.name);
            rootDir.addChild(newFile);
        }
    }

    return rootDir;
}



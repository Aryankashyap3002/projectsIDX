import  fs  from 'fs/promises';
import path from 'path';

export const handleEditorSocketEvent = (socket, editorNamespace) => {
    socket.on("writeFile", async ({ data, pathToFileOrFolder }) => {
        try {
            const paths = path.resolve(pathToFileOrFolder);
            const fileName = path.basename(paths);
            await fs.writeFile(paths, data);
            socket.join(fileName);
            editorNamespace.to(fileName).emit("writeFileSuccess", {
                path: paths,
                data: "File written successfully"
            })
        } catch (error) {
            socket.emit("error", {
                data: "error while writing file"
            })
        }
    });

    socket.on("createFile", async ({ pathToFileOrFolder }) => {
        const paths = path.resolve(pathToFileOrFolder);
            const fileOrFolderExist = await fs.stat(paths);
            if(fileOrFolderExist) {
                socket.emit("error", {
                    data: "File already exists"
                });
                return;
            }

        try {
            const paths = path.resolve(pathToFileOrFolder);
            const response = await fs.stat(paths);
            socket.emit("fileCreationSuccessful", {
                data: "File created exists"
            })
        } catch (error) {
            socket.emit("error", {
                data: "error while creating file"
            })
        }
    });

    socket.on("readFile", async ({ pathToFileOrFolder }) => {
        try {
            const paths = path.resolve(pathToFileOrFolder);
            const response = await fs.readFile(paths);
            const fileName = path.basename(paths);
            const extension = fileName.split('.')[fileName.split('.').length-1];
            console.log(response.toString());
            socket.emit("readFileSuccess", {
                data: response.toString(),
                path: paths,
                extension: extension
               
            })
        } catch (error) {
            socket.emit("error", {
                data: "error while creating file"
            })
        }
    });

    socket.on("deleteFile", async ({ pathToFileOrFolder }) => {
        try {
            const paths = path.resolve(pathToFileOrFolder);
            await fs.unlink(paths);
            socket.emit("deleteFileSuccess", {
                data: "File deleted successfully"
            })
        } catch(error) {
            console.log(error);
            socket.emit("error", {
                data: "error while deleting the file"
            })
        } 
    });

    socket.on("createFolder", async ({ pathToFileOrFolder }) => {
        try {
            const paths = path.resolve(pathToFileOrFolder);
            
            try {
                const stats = await fs.stat(paths);
                if (stats.isDirectory()) {
                    socket.emit("error", {
                        data: "Folder already exists"
                    });
                    return;
                }
            } catch (error) {
            }

            await fs.mkdir(paths, { recursive: true });
            socket.emit("createFolderSuccess", {
                data: "Folder created successfully"
            });
        } catch (error) {
            socket.emit("error", {
                data: "error while creating folder"
            });
        }
    });

    socket.on("deleteFolder", async ({ pathToFileOrFolder }) => {
        try {
            const paths = path.resolve(pathToFileOrFolder);
            
            const stats = await fs.stat(paths);
            if (!stats.isDirectory()) {
                socket.emit("error", {
                    data: "Path is not a directory"
                });
                return;
            }

            await fs.rmdir(paths, { recursive: true });
            socket.emit("deleteFolderSuccess", {
                data: "Folder deleted successfully"
            });
        } catch (error) {
            console.log(error);
            socket.emit("error", {
                data: "error while deleting folder"
            });
        }
    });

    socket.on("renameFile", async ({ pathToFileOrFolder, name }) => {
        try {
             const paths = path.resolve(pathToFileOrFolder);
            const directory = path.dirname(paths);
            const newPath = path.join(directory, name)
            await fs.rename(paths, newPath);
            socket.emit("renameFileSuccess", {
                data: "Successfully rename the file"
            })
        } catch (error) {
            console.log(error);
            socket.emit('error', {
                data: "error while renaming the file"
            })
        }
    });

    socket.on("renameFolder", async ({ pathToFileOrFolder, name }) => {
        try {
             const paths = path.resolve(pathToFileOrFolder);
            const directory = path.dirname(paths);
            const newPath = path.join(directory, name)
            await fs.rename(paths, newPath);
            socket.emit("renameFileSuccess", {
                data: "Successfully rename the folder"
            })
        } catch (error) {
            console.log(error);
            socket.emit('error', {
                data: "error while renaming the folder"
            }) 
        }
    });
}
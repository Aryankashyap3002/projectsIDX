import Dockerode from "dockerode";

const dockerode = new Dockerode();

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
    console.log("Terminal attached to project with project Id: ", projectId);
    
    try {

         const allContainers = await dockerode.listContainers({ all: true });

         const existingContainer = allContainers.find(container => {
            // Docker container names start with '/', so we check both formats
            return container.Names.some(name => 
                name === `/${projectId}` || name === projectId
            );
        });

        if(existingContainer) {
            const container = dockerode.getContainer(existingContainer.Id); 
            await container.remove({force: true}); 
            console.log("Removed existing container:", existingContainer.Id);
        }


        console.log("Creating a new container");
        const container = await dockerode.createContainer({
            Image: 'sandbox',
            AttachStdout: true,
            AttachStdin: true,
            Cmd: ['/bin/bash'],
            name: projectId,
            Tty: true,
            User: 'sandbox',
            ExposedPorts: {
                    "5173/tcp": {}
            },
            Env: ["HOST=0.0.0.0"],
            HostConfig: {
                Binds: [
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    "5173/tcp": [
                        {
                            "HostPort": "0"
                        }
                    ]
                },
                
            }
        })
        console.log("Container created", container.id);

        await container.start();

        return container;

    } catch (error) {
        console.log("Error while creating container", error);
    }
}

export async function getContainerPort(containerName) {

    const allContainers = await dockerode.listContainers({ all: true });

    const existingContainer = allContainers.find(container => {
            return container.Names.some(name => 
                name === `/${containerName}` || name === containerName
            );
        });


    if(existingContainer) {
        const containerInfo = await dockerode.getContainer(existingContainer.Id).inspect();
        console.log("Container info", containerInfo);
        if (containerInfo.NetworkSettings.Ports["5173/tcp"] && 
            containerInfo.NetworkSettings.Ports["5173/tcp"].length > 0) {
            return containerInfo.NetworkSettings.Ports["5173/tcp"][0].HostPort;
        } else {
            console.log("Port 5173 not found or not mapped");
            return null;
        }
    }
}

 
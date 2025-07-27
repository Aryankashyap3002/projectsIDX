import Dockerode from "dockerode";

const dockerode = new Dockerode();

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
    console.log("Terminal attached to project with project Id: ", projectId);
    
    try {

        const existingContainer = await dockerode.listContainers({
            name: projectId
        })

        if(existingContainer.length > 0) {
            const container = dockerode.getContainer(existingContainer[0].id);
            await container.remove({force: true}); 
        }



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
            Env: ["Host=0.0.0.0"],
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

        console.log("Container is started");

        terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
            terminalSocket.emit("connection", establishedWSConn, req, container);
        })

    } catch (error) {
        console.log("Error while creating container", error);
    }
}


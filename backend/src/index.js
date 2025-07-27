import express from "express";
import { PORT } from "./config/serverConfig.js";
import apiRoutes from "./route/index.js"
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import { handleEditorSocketEvent } from "./socketHandler/editoHandler.js";
import queryString from "query-string";
import { handleContainerCreate } from "./handleContainerCreate/handleContainerCreate.js";
import { WebSocketServer } from "ws";
import { handleTerminalCreation } from "./handleTerminalCreation/handleTerminalCreation.js";

const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', apiRoutes);
 
app.get('/ping', (req, res) => {
    return res.json({msg: 'pong'});
})

const editorNamespace = io.of('/editor');

editorNamespace.on('connection', (socket) => {
    console.log("User is connected");

    const queryParams = queryString.parse(socket.handshake);
    console.log(queryParams);
    const projectId = socket.request._query.projectId;

    handleEditorSocketEvent(socket, editorNamespace)
});

server.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});

const webSocketForTerminal = new WebSocketServer({
    noServer: true
});

webSocketForTerminal.on("connection", (ws, req, container) => {
    console.log("Terminal is connected");
    console.log(container);
    handleTerminalCreation(container, ws);

    ws.on("getport", () => {
        console.log("Port is received");
    })

    ws.on("close", () => {
        container.remove({ force: true }, (err, data) => {
            if(err) {
                console.log("Error while removing container", err);
            }
            console.log("container removed", data);
        })
    })
})

server.on("upgrade", (req, tcp, head) => {
    const isTerminal = req.url.includes("/terminal");

    if(isTerminal) {
        console.log("req url received", req.url);
        const projectId = req.url.split('=').pop();
        console.log("Project received after connection", projectId);
        handleContainerCreate(projectId, webSocketForTerminal, req, tcp, head);
    }
});








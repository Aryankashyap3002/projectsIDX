import express from "express";
import { PORT } from "./config/serverConfig.js";
import apiRoutes from "./route/index.js"
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import { handleEditorSocketEvent } from "./socketHandler/editorHandler.js";
import queryString from "query-string";


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
    console.log("Project id received after connection", projectId);

    handleEditorSocketEvent(socket, editorNamespace)
});

server.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});


import express from 'express';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/index.js'
import cors from "cors";
 import bullServerAdapter from './config/bullBoardConfig.js';
 import connectDB from './config/dbConfig.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/ui', bullServerAdapter.getRouter());
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
    connectDB();
})
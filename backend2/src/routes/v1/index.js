import express from 'express';
import userRouter from './users.js';
import projectRouter from './projects.js'
 
 const router = express.Router();

 router.use('/users', userRouter);
 router.use('/projects', projectRouter);

 

 
 export default router;
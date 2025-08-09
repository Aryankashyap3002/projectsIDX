import express from 'express';
import { projectController, projectTreeController, getAllProjectController } from '../../controller/projectController.js';

const router = express.Router();

router.post('/', projectController);
router.get('/:projectId/tree', projectTreeController);
router.get('/allProjects', getAllProjectController);

export default router;
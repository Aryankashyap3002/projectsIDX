import express from 'express';
import { projectController, projectTreeController } from '../../controller/projectController.js';

const router = express.Router();

router.post('/', projectController);
router.get('/:projectId/tree', projectTreeController);

export default router;
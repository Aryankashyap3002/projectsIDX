import express from 'express';
import { pingChecker } from '../../controller/pingController.js';
import projectApi from './project.js'

const router = express.Router();

router.use('/ping', pingChecker)

router.use('/projects', projectApi)

export default router;
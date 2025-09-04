import express from 'express';

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  archiveProject,
  restoreProject,
  getProjectStats,
  getPublicProjects,
  duplicateProject,
  bulkDeleteProjects,
  bulkArchiveProjects
} from '../../controllers/projectController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public', getPublicProjects);

// Protected routes (authentication required)
router.use(isAuthenticated); // Apply authentication middleware to all routes below

// Project CRUD operations
router.post('/', createProject);
router.get('/', getProjects);
router.get('/stats', getProjectStats);
router.get('/:projectId', getProjectById);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);

// Project lifecycle operations
router.patch('/:projectId/archive', archiveProject);
router.patch('/:projectId/restore', restoreProject);
router.post('/:projectId/duplicate', duplicateProject);

// Bulk operations
router.post('/bulk/delete', bulkDeleteProjects);
router.post('/bulk/archive', bulkArchiveProjects);

export default router;
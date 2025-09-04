import { StatusCodes } from 'http-status-codes';

import { 
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  archiveProjectService,
  restoreProjectService,
  getProjectStatsService,
  getPublicProjectsService,
  duplicateProjectService
} from '../service/projectService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';
import userRepository from '../repository/userRepository.js';

export const createProject = async (req, res) => {
  try {
    // Fetch full user details since req.user is just the user ID
    const user = await userRepository.getById(req.user);
    
    if (!user) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          message: 'User not found',
          statusCode: StatusCodes.FORBIDDEN
        })
      );
    }

    const projectData = {
      ...req.body,
      userId: user.id || user._id, // Handle both id and _id
      userInfo: {
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    };

    const project = await createProjectService(projectData);

    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(project, 'Project created successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user; // req.user is the user ID string
    console.log("User id is: ", userId);
    
    const projects = await getProjectsService(userId);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(projects, 'Projects retrieved successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user; // req.user is the user ID string

    const project = await getProjectByIdService(projectId, userId);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(project, 'Project retrieved successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user; // req.user is the user ID string
    const updateData = req.body;

    const updatedProject = await updateProjectService(projectId, userId, updateData);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(updatedProject, 'Project updated successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user; // req.user is the user ID string
    const hardDelete = req.query.hard === 'true'; // ?hard=true for permanent deletion

    const result = await deleteProjectService(projectId, userId, hardDelete);

    const message = hardDelete 
      ? 'Project deleted permanently' 
      : 'Project moved to trash';

    return res
      .status(StatusCodes.OK)
      .json(successResponse(result, message));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const archiveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user; // req.user is the user ID string

    const archivedProject = await archiveProjectService(projectId, userId);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(archivedProject, 'Project archived successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const restoreProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user; // req.user is the user ID string

    const restoredProject = await restoreProjectService(projectId, userId);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(restoredProject, 'Project restored successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const userId = req.user; // req.user is the user ID string

    const stats = await getProjectStatsService(userId);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(stats, 'Project statistics retrieved successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getPublicProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getPublicProjectsService(page, limit);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(result, 'Public projects retrieved successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const duplicateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user; // req.user is the user ID string
    const { newName } = req.body;

    const duplicatedProject = await duplicateProjectService(projectId, userId, newName);

    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(duplicatedProject, 'Project duplicated successfully'));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

// Bulk operations
export const bulkDeleteProjects = async (req, res) => {
  try {
    const { projectIds } = req.body; // Array of project IDs
    const userId = req.user; // req.user is the user ID string

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(customErrorResponse({
          message: 'Project IDs array is required',
          statusCode: StatusCodes.BAD_REQUEST
        }));
    }

    // Verify all projects belong to the user before bulk deletion
    const verificationPromises = projectIds.map(id => 
      getProjectByIdService(id, userId)
    );
    
    await Promise.all(verificationPromises);

    // Perform bulk soft delete
    const deletePromises = projectIds.map(id => 
      deleteProjectService(id, userId, false)
    );
    
    const results = await Promise.all(deletePromises);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(
        { deletedCount: results.length }, 
        `${results.length} projects moved to trash`
      ));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const bulkArchiveProjects = async (req, res) => {
  try {
    const { projectIds } = req.body;
    const userId = req.user; // req.user is the user ID string

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(customErrorResponse({
          message: 'Project IDs array is required',
          statusCode: StatusCodes.BAD_REQUEST
        }));
    }

    const archivePromises = projectIds.map(id => 
      archiveProjectService(id, userId)
    );
    
    const results = await Promise.all(archivePromises);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(
        { archivedCount: results.length }, 
        `${results.length} projects archived successfully`
      ));
  } catch (error) {
    console.log('Project controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
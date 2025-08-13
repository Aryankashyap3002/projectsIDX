import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import projectRepository from '../repository/projectRepository.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const createProjectService = async (data) => {
  try {
    // Generate auto name if not provided
    if (!data.name) {
      const timestamp = new Date().toISOString().split('T')[0];
      data.name = `${data.type}-project-${timestamp}-${uuidv4().substring(0, 6)}`;
    }

    // Validate required fields
    if (!data.userId || !data.userInfo) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User information is required to create a project',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const newProject = await projectRepository.create(data);
    return newProject;
  } catch (error) {
    console.log('Project service error', error);
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['A project with the same name already exists for this user']
        },
        'Duplicate project name'
      );
    }
    throw error;
  }
};

export const getProjectsService = async (userId) => {
  try {
    if (!userId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User ID is required',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    let projects = await projectRepository.getByUserId(userId);
    let projectContainer;

    if(projects) {
      projectContainer = projects.map((ele) => ({
        name: ele.name
      }))
    }
    
    console.log("Projects are: ", projectContainer);

    return projectContainer;
  } catch (error) {
    console.log('Project service error', error);
    throw error;
  }
};

export const getProjectByIdService = async (projectId, userId) => {
  try {
    if (!projectId || !userId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Project ID and User ID are required',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const project = await projectRepository.getByIdAndUserId(projectId, userId);
    
    if (!project) {
      throw new ClientError({
        explanation: 'Resource not found',
        message: 'Project not found or you do not have access to this project',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // Update last accessed time
    await projectRepository.updateLastAccessed(projectId, userId);

    return project;
  } catch (error) {
    console.log('Project service error', error);
    throw error;
  }
};

export const updateProjectService = async (projectId, userId, updateData) => {
  try {
    if (!projectId || !userId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Project ID and User ID are required',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    // First check if project exists and belongs to user
    const existingProject = await projectRepository.getByIdAndUserId(projectId, userId);
    
    if (!existingProject) {
      throw new ClientError({
        explanation: 'Resource not found',
        message: 'Project not found or you do not have access to this project',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // Update the project
    const updatedProject = await projectRepository.update(projectId, {
      ...updateData,
      lastAccessedAt: new Date()
    });

    return updatedProject;
  } catch (error) {
    console.log('Project service error', error);
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    throw error;
  }
};

export const deleteProjectService = async (projectId, userId, hardDelete = false) => {
  try {
    if (!projectId || !userId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Project ID and User ID are required',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    // First check if project exists and belongs to user
    const existingProject = await projectRepository.getByIdAndUserId(projectId, userId);
    
    if (!existingProject) {
      throw new ClientError({
        explanation: 'Resource not found',
        message: 'Project not found or you do not have access to this project',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    let result;
    if (hardDelete) {
      result = await projectRepository.delete(projectId);
    } else {
      // Soft delete - mark as deleted
      result = await projectRepository.softDelete(projectId, userId);
    }

    return result;
  } catch (error) {
    console.log('Project service error', error);
    throw error;
  }
};

export const archiveProjectService = async (projectId, userId) => {
  try {
    if (!projectId || !userId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Project ID and User ID are required',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const archivedProject = await projectRepository.archive(projectId, userId);
    
    if (!archivedProject) {
      throw new ClientError({
        explanation: 'Resource not found',
        message: 'Project not found or you do not have access to this project',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return archivedProject;
  } catch (error) {
    console.log('Project service error', error);
    throw error;
  }
};

export const restoreProjectService = async (projectId, userId) => {
  try {
    if (!projectId || !userId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Project ID and User ID are required',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const restoredProject = await projectRepository.restore(projectId, userId);
    
    if (!restoredProject) {
      throw new ClientError({
        explanation: 'Resource not found',
        message: 'Project not found or you do not have access to this project',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return restoredProject;
  } catch (error) {
    console.log('Project service error', error);
    throw error;
  }
};

export const getProjectStatsService = async (userId) => {
  try {
    if (!userId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User ID is required',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const stats = await projectRepository.getUserProjectStats(userId);
    const totalCount = await projectRepository.getProjectCount(userId, 'active');
    const recentProjects = await projectRepository.getRecentlyAccessed(userId, 5);

    return {
      ...stats,
      totalActiveProjects: totalCount,
      recentProjects
    };
  } catch (error) {
    console.log('Project service error', error);
    throw error;
  }
};

export const getPublicProjectsService = async (page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    const projects = await projectRepository.getPublicProjects(limit, skip);
    
    return {
      projects,
      page,
      limit,
      hasMore: projects.length === limit
    };
  } catch (error) {
    console.log('Project service error', error);
    throw error;
  }
};

export const duplicateProjectService = async (projectId, userId, newName = null) => {
  try {
    if (!projectId || !userId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Project ID and User ID are required',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    // Get the original project
    const originalProject = await projectRepository.getByIdAndUserId(projectId, userId);
    
    if (!originalProject) {
      throw new ClientError({
        explanation: 'Resource not found',
        message: 'Project not found or you do not have access to this project',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // Create duplicate with new name
    const duplicateData = {
      ...originalProject.toObject(),
      name: newName || `${originalProject.name} (Copy)`,
      _id: undefined, // Remove original ID
      createdAt: undefined,
      updatedAt: undefined,
      lastAccessedAt: new Date()
    };

    const duplicatedProject = await projectRepository.create(duplicateData);
    return duplicatedProject;
  } catch (error) {
    console.log('Project service error', error);
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    throw error;
  }
};
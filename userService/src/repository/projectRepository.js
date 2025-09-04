import Project from '../scheme/project.js';
import crudRepository from './crudRepository.js';

const projectRepository = {
  ...crudRepository(Project),

  // Get all projects for a specific user
  getByUserId: async function (userId) {
    const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
    return projects;
  },

  // Get projects by user and type
  getByUserIdAndType: async function (userId, type) {
    const projects = await Project.find({ 
      userId, 
      type, 
      status: 'active' 
    }).sort({ createdAt: -1 });
    return projects;
  },

  // Get project by ID and user ID (for security - ensure user owns the project)
  getByIdAndUserId: async function (projectId, userId) {
    const project = await Project.findOne({ 
      _id: projectId, 
      userId: userId 
    });
    return project;
  },

  // Search projects by name for a user
  searchByName: async function (userId, searchTerm) {
    const projects = await Project.find({
      userId,
      status: 'active',
      name: { $regex: searchTerm, $options: 'i' }
    }).sort({ updatedAt: -1 });
    return projects;
  },

  // Get projects by tags
  getByTags: async function (userId, tags) {
    const projects = await Project.find({
      userId,
      status: 'active',
      tags: { $in: tags }
    }).sort({ updatedAt: -1 });
    return projects;
  },

  // Update project status (archive, delete, activate)
  updateStatus: async function (projectId, userId, status) {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, userId: userId },
      { status: status },
      { new: true }
    );
    return updatedProject;
  },

  // Soft delete project (mark as deleted instead of actual deletion)
  softDelete: async function (projectId, userId) {
    const deletedProject = await Project.findOneAndUpdate(
      { _id: projectId, userId: userId },
      { status: 'deleted' },
      { new: true }
    );
    return deletedProject;
  },

  // Archive project
  archive: async function (projectId, userId) {
    const archivedProject = await Project.findOneAndUpdate(
      { _id: projectId, userId: userId },
      { status: 'archived' },
      { new: true }
    );
    return archivedProject;
  },

  // Restore project (change from archived/deleted to active)
  restore: async function (projectId, userId) {
    const restoredProject = await Project.findOneAndUpdate(
      { _id: projectId, userId: userId },
      { status: 'active' },
      { new: true }
    );
    return restoredProject;
  },

  // Update last accessed time
  updateLastAccessed: async function (projectId, userId) {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, userId: userId },
      { lastAccessedAt: new Date() },
      { new: true }
    );
    return updatedProject;
  },

  // Get recently accessed projects
  getRecentlyAccessed: async function (userId, limit = 10) {
    const projects = await Project.find({
      userId,
      status: 'active'
    })
    .sort({ lastAccessedAt: -1 })
    .limit(limit);
    return projects;
  },

  // Get public projects (for showcasing)
  getPublicProjects: async function (limit = 20, skip = 0) {
    const projects = await Project.find({
      isPublic: true,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('name type description userInfo createdAt tags'); // Only return necessary fields
    return projects;
  },

  // Get project count by user
  getProjectCount: async function (userId, status = 'active') {
    const count = await Project.countDocuments({ userId, status });
    return count;
  },

  // Get projects by type (across all users - for analytics)
  getProjectsByType: async function (type, limit = 50) {
    const projects = await Project.find({
      type,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .limit(limit);
    return projects;
  },

  // Bulk update projects for a user (useful for migrations)
  bulkUpdateByUserId: async function (userId, updateData) {
    const result = await Project.updateMany(
      { userId },
      updateData
    );
    return result;
  },

  // Delete all projects for a user (when user account is deleted)
  deleteAllByUserId: async function (userId) {
    const result = await Project.deleteMany({ userId });
    return result;
  },

  // Get project statistics for a user
  getUserProjectStats: async function (userId) {
    const stats = await Project.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const typeStats = await Project.aggregate([
      { $match: { userId, status: 'active' } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    return {
      statusStats: stats,
      typeStats: typeStats
    };
  }
};

export default projectRepository;
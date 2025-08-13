import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            maxLength: [100, 'Project name cannot exceed 100 characters']
        },
        type: {
            type: String,
            required: [true, 'Project type is required'],
            enum: ['react', 'vue', 'angular', 'node', 'python', 'java', 'other'],
            default: 'react'
        },
        description: {
            type: String,
            maxLength: [500, 'Description cannot exceed 500 characters'],
            trim: true
        },
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true 
        },
        userInfo: {
            username: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            avatar: {
                type: String
            }
        },
        
        config: {
            framework: String,
            dependencies: [String],
            buildTool: String,
            deploymentUrl: String
        },
        collaborators: [{
            userId: String,
            username: String,
            role: {
                type: String,
                enum: ['owner', 'admin', 'contributor', 'viewer'],
                default: 'viewer'
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }],


        lastAccessedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        indexes: [
            { userId: 1, createdAt: -1 },
            { userId: 1, status: 1 },
            { type: 1 },
            { tags: 1 }
        ]
    }
);

projectSchema.pre('save', function(next) {
    this.lastAccessedAt = new Date();
    next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;

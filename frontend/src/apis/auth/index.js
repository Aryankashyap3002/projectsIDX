import { userBackendInstance } from "@/config/axiosConfig";

// Existing auth functions
export const signUpRequest = async ({ email, password, username }) => {
    try {
        const response = await userBackendInstance.post('/users/signup', {
            email,
            password,
            username
        });
        return response.data;
    } catch(error) {
        console.error(error);
        throw error.response.data;     
    }
};

export const signInRequest = async ({ email, password }) => {
    try {
        const response = await userBackendInstance.post('/users/signin', {
            email,
            password
        });
        return response.data;
    } catch(error) {
        console.error(error);
        throw error.response.data;     
    }
};

// Project-related functions for user service (using your existing endpoints)
export const getUserProjects = async ({ token }) => {
    try {
        const response = await userBackendInstance.get('/projects', {
            headers: {
                'x-access-token': token
            }
        });
        return response.data;
    } catch(error) {
        console.error('Error fetching user projects:', error);
        throw error.response?.data || error;     
    }
};

export const createUserProject = async ({ name, type, projectId, token }) => {
    try {
        const response = await userBackendInstance.post('/projects', {
            name,
            type,
            projectId
        }, {
            headers: {
                'x-access-token': token
            }
        });
        return response.data;
    } catch(error) {
        console.error('Error creating user project:', error);
        throw error.response?.data || error;     
    }
};

export const getUserProjectById = async (projectId) => {
    try {
        const response = await userBackendInstance.get(`/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch(error) {
        console.error('Error fetching project by ID:', error);
        throw error.response?.data || error;     
    }
};
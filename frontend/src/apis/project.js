import axios from "../config/axiosConfig";

export default async function createProjectApi ({name, type}) {
    console.log("Project Name is: ",name);
    try {
        
        const response = await axios.post('/api/v1/projects', {name: name, type: type});
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getProjectTree ({ projectId }) {
    try {
        const response = await axios.get(`/api/v1/projects/${projectId}/tree`);
        console.log("projectTree response ", response.data?.data);
        return response.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
} 

export async function getAllProjects () {
    try {
        const response = await axios.get('/api/v1/projects/allProjects');
        console.log("Projects are: ", response.data?.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}
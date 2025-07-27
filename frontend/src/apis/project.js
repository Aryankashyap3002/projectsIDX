import axios from "../config/axiosConfig";

export default async function createProjectApi () {
    try {
        const response = await axios.post('/api/v1/projects');
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
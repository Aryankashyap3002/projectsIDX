import axios from "../config/axiosConfig"

export async function pingApi() {
    try {
        const response = await axios.get("/api/v1/ping");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error in axios api ", error);
    }
}
import { userBackendInstance } from "@/config/axiosConfig";
 
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
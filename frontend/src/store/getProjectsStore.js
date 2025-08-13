import { getAllProjects } from "@/apis/project";
import { getUserProjects } from "@/apis/auth"; // New user service API
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { toast } from "sonner";

export const useGetProjectsStore = create((set, get) => {
    const queryClient = new QueryClient();

    return {
        projects: null,
        isLoading: false,
        error: null,
        
        // Your original method - now fetches from user service instead
        setProjects: async ({useUserService = true, token}) => {
            set({ isLoading: true, error: null });
            
            try {
                let data;
                
                if (useUserService) {
                    // Fetch from user service (recommended - shows user's projects)
                    console.log('Fetching projects from user service...');
                    data = await queryClient.fetchQuery({
                        queryKey: ['userProjects'],
                        queryFn: () => getUserProjects({token})
                    });
                } else {
                    // Fallback to project service (your original method)
                    console.log('Fetching projects from project service...');
                    data = await queryClient.fetchQuery({
                        queryKey: ['projects'],
                        queryFn: () => getAllProjects()
                    });
                }

                set({
                    projects: data,
                    isLoading: false,
                    error: null
                });

                return data;
            } catch (error) {
                console.error('Error fetching projects:', error);
                
                set({
                    projects: null,
                    isLoading: false,
                    error: error.message || 'Failed to fetch projects'
                });

                // Handle specific error cases
                if (error.status === 401) {
                    toast.error('Please sign in to view your projects');
                } else {
                    toast.error('Failed to load projects. Please try again.');
                }

                throw error;
            }
        },

        // Keep your original method as fallback
        setProjectsFromProjectService: async () => {
            return get().setProjects(false);
        },

        // New method specifically for user service
        setUserProjects: async () => {
            return get().setProjects(true);
        },

        // Additional utility methods
        clearProjects: () => {
            set({
                projects: null,
                isLoading: false,
                error: null
            });
        },

        refreshProjects: async (useUserService = true) => {
            // Clear cache and refetch
            if (useUserService) {
                queryClient.removeQueries(['userProjects']);
            } else {
                queryClient.removeQueries(['projects']);
            }
            
            return get().setProjects(useUserService);
        }
    }
})
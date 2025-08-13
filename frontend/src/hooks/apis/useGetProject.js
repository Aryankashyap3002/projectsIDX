import { getAllProjects } from "@/apis/project";
import { getUserProjects } from "@/apis/auth"; // User service API
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { toast } from "sonner";

export const useGetProjectsStore = create((set, get) => {
    const queryClient = new QueryClient();

    return {
        projects: null,
        isLoading: false,
        error: null,
        
        // Updated to use user service by default
        setProjects: async (filters = {}) => {
            set({ isLoading: true, error: null });
            
            try {
                console.log('Fetching projects from user service...');
                const data = await queryClient.fetchQuery({
                    queryKey: ['userProjects', filters],
                    queryFn: () => getUserProjects(filters)
                });

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

        // Fallback method to use project service (your original method)
        setProjectsFromProjectService: async () => {
            set({ isLoading: true, error: null });
            
            try {
                console.log('Fetching projects from project service...');
                const data = await queryClient.fetchQuery({
                    queryKey: ['projects'],
                    queryFn: () => getAllProjects()
                });

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

                toast.error('Failed to load projects. Please try again.');
                throw error;
            }
        },

        // Additional utility methods
        clearProjects: () => {
            set({
                projects: null,
                isLoading: false,
                error: null
            });
        },

        refreshProjects: async (filters = {}) => {
            // Clear cache and refetch
            queryClient.removeQueries(['userProjects']);
            return get().setProjects(filters);
        }
    }
})
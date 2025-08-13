import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createUserProject } from '@/apis/auth'; // User service API (your existing endpoint)
import { useAuth } from '@/hooks/context/useAuth';

export const useCreateProject2 = () => {
    const { auth } = useAuth();
    
    const { isPending, isSuccess, error, mutateAsync: createProjectMutationUser } = useMutation({
        mutationFn: async ({ name, type, token }) => {
            // Create project directly in user service (your existing endpoint)
            console.log('Creating project in user service...');
            const response = await createUserProject({ name, type, token });
            console.log('User service response:', response);
            
            return response;
        },
        onSuccess: (response, variables) => {
            console.log('Project created successfully:', response);
            toast.success(`Project "${variables.name || 'Untitled'}" created successfully!`, {
                description: 'Project has been created and associated with your account',
                duration: 4000,
            });
        },
        onError: (error, variables) => {
            console.error('Failed to create project:', error);
            
            // More specific error handling
            let errorMessage = 'Failed to create project. Please try again.';
            
            if (error.message?.includes('token') || error.message?.includes('unauthorized')) {
                errorMessage = 'Session expired. Please sign in again.';
            } else if (error.message?.includes('Duplicate')) {
                errorMessage = 'A project with this name already exists. Please choose a different name.';
            }
            
            toast.error(errorMessage, {
                description: `Project: "${variables.name || 'Untitled'}" (${variables.type})`,
                duration: 6000,
            });
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        createProjectMutationUser
    };
};
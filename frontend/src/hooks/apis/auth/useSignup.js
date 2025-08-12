import { useMutation } from '@tanstack/react-query';
 import { toast } from 'sonner';

 import { signUpRequest } from '@/apis/auth';

 
 export const useSignup = () => {
    const { isPending, isSuccess, error, mutateAsync: signupMutation } = useMutation({
         mutationFn: signUpRequest,
         onSuccess: (data) => {
             console.log('Scuccessfuilly signed up', data);
             toast.success('Successfully signed up', {
                style: { 
                    textAlign: 'center', 
                    color: 'white',
                    backgroundColor: '#129903'
                },
                description: 'You will be redirected to the login page in a few seconds',
                // Add this to style the description text
                descriptionStyle: {
                    color: 'black'
                }
            });
         },
         onError: (error) => {
             console.error('Failed to sign up', error);
             toast.error('Failed to sign up', {
                description: error.message,
                style: { backgroundColor: '#dc2626', color: 'white', textAlign: 'center' }, // Custom styling for "destructive" variant
            });
         }
     });
 
     return {
         isPending,
         isSuccess,
         error,
         signupMutation
     };
 };
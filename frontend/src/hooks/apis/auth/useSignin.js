import { useMutation } from '@tanstack/react-query';
 import { toast } from 'sonner';

 import { signInRequest } from '@/apis/auth';
 import { useAuth } from '@/hooks/context/useAuth'; 
 
 export const useSignin = () => {
    const { setAuth } = useAuth();
     const { isPending, isSuccess, error, mutateAsync: signinMutation } = useMutation({
         mutationFn: signInRequest,
         onSuccess: (response) => {
             console.log('Scuccessfully signed in', response);

             const userObject = JSON.stringify(response.data);

             localStorage.setItem('user', userObject);
             localStorage.setItem('token', response.data.token);

             setAuth({
                token: response.data.token,
                user: response.data,
                loading: false
            });

              
             toast.success('Successfully signed up', {
                style: { 
                    textAlign: 'center', 
                    color: 'white',
                    backgroundColor: '#129903',
                },
                description: 'You will be redirected to the login page in a few seconds',
                // Add this to style the description text
                descriptionStyle: {
                    color: 'black'
                }
            });
         },
         onError: (error) => {
             console.error('Failed to sign in', error);
             toast.error('Failed to sign in', {
                description: error.message,
                style: { backgroundColor: '#dc2626', color: 'white', textAlign: 'center' }, // Custom styling for "destructive" variant
            });
         }
     });
 
     return {
         isPending,
         isSuccess,
         error,
         signinMutation
     };
 };
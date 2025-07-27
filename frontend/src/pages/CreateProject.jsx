import { useNavigate } from 'react-router-dom';
import { useCreateProject } from "../hooks/apis/mutation/useCreateProject";
import { Button } from '@/components/ui/button';

export function CreateProject () {
    const { isPending, createProjectMutation } = useCreateProject();
    const Navigate =  useNavigate();
    async function handleClick () {
        try {
            const response = await createProjectMutation();
            console.log(response.data);
            Navigate(`/project/${response?.data}`)
        } catch (error) {
            console.log(error);
        }
    }

    if(isPending) {
        return (
            <h2>Loading...</h2>
        )
    }

    return (
        <div className='flex justify-center items-center mt-[50vh]'>
            <Button 
                onClick={handleClick}
                variant="outline"
                className={"bg-blue-600 text-white"}
            >
                Create Project
            </Button>
        </div>
    )
}
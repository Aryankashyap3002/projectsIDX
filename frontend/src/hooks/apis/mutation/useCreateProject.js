import { useMutation } from "@tanstack/react-query"
import createProjectApi from "../../../apis/project"

export const useCreateProject = () => {
    const { mutateAsync, isPending, isError, isSuccess } =  useMutation({
        mutationFn: createProjectApi,
        onSuccess: (data) => {
            console.log("Project created successfully ", data)
        },
        onError: (error) => {
            console.log(error);
            throw error;
        }
    });

    return {
        createProjectMutation: mutateAsync,
        isPending,
        isSuccess,
        isError
    }
}
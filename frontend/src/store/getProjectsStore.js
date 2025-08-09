import { getAllProjects } from "@/apis/project";
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";

export const useGetProjectsStore = create((set, ) => {

    const queryClient = new QueryClient();

   return {
        projects: null,
        setProjects : async () => {
            const data = await queryClient.fetchQuery({
                queryKey: ['projects'],
                queryFn: () => getAllProjects()
            })

            set({
                projects: data
            })
        }
   }
})
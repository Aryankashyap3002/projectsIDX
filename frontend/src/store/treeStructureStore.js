import { getProjectTree } from "@/apis/project";
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";

export const useTreeStructureStore = create((set, get) => {

    const queryClient = new QueryClient();

    return {
        projectId: null,
        treeStructure: null,
        setTreeStructure: async () => {
            const id = get().projectId;
            const data = await queryClient.fetchQuery({
                queryKey: [`${id}`],
                queryFn: () => getProjectTree({projectId: id})
            })

            set({
                treeStructure: data
            })
        },

        setProjectId: (projectId) => {
            set({
                projectId: projectId
            })
        }
    }
})
import { TreeNode } from "@/components/molecules/TreeNode/TreeNode";
import { useTreeStructureStore } from "@/store/treeStructureStore"
import { useEffect } from "react";

export function TreeStructure () {

    const { projectId, treeStructure, setTreeStructure } = useTreeStructureStore();

    useEffect(() => {
        
        if(treeStructure) {
            console.log(treeStructure.children);
        } else {
            setTreeStructure({ projectId });
        }
        
    }, [projectId, setTreeStructure, treeStructure]);

    return (
        <>
            <TreeNode fileFolderData={treeStructure}/>
        </>
        
    )
} 
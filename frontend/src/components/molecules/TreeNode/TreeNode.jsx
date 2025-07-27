import { useEffect, useRef, useState } from "react";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowDown } from "react-icons/sl";
import { FileIcon } from "@/components/atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "@/store/editorSocketStore";
import { useActiveFileButtonStore } from "@/store/activeFileButtonStore";

export function TreeNode({ fileFolderData }) {
    const [isOpen, setIsOpen] = useState({});
    const { addActiveFileList, activeFileList, inc, count, setMaxCount } = useActiveFileButtonStore();
    const fileName = useRef();
    const path = useRef();
    const { editorSocket, setEditorSocket } = useEditorSocketStore();

    function toggleOpen(name) {
        setIsOpen({
            ...isOpen,
            [name]: !isOpen[name]
        });
    }

    function handleExtension(name) {
        const names = name.split('.');
        return names[names.length - 1];
    }

    function isFolder(item) {
        return item.children && item.children.length > 0;
    }

    function handleFileClick (data) {
        path.current = data.path;
        fileName.current = data.path.split('/').pop();
        let isExist = false;
        activeFileList.map((ele) => {
            if(ele.id === fileName.current) {
                isExist = true;
                console.log(ele.id, ele.number)
            }
        })
        if(!isExist) {
            inc();
            setMaxCount(count);
            addActiveFileList(fileName.current, path.current);

            
        }
        activeFileList.map((ele) => {
                console.log(ele.number, ele.id, count);
        })
        console.log("File data is: ", data.path);
        editorSocket.emit("readFile", {
            pathToFileOrFolder: data.path
        });
        setEditorSocket(editorSocket);
    }

    useEffect(() => {
        console.log("visibility change: ", isOpen);
    }, [isOpen, fileFolderData]);

    return (
        fileFolderData && (
            <div 
                style={{
                    paddingLeft: '10px',
                    color: "white",
                    marginTop: '8px'
                }}
            >
                {isFolder(fileFolderData) ? (
                    <div>
                        <button 
                            style={{
                                outline: 'none',
                                border: 'none',
                                backgroundColor: 'transparent',
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '5px',
                                gap: '8px',
                                color: 'white',
                                marginTop: '8px',
                                cursor: 'pointer'
                            }}
                            onClick={() => toggleOpen(fileFolderData.name)}
                        >
                            {isOpen[fileFolderData.name] ? <SlArrowDown /> : <SlArrowRight />}
                            📁 {fileFolderData.name}
                        </button>
                    </div>
                ) : (
                    <div
                        style={{
                            paddingLeft: '7px',
                            outline: 'none',
                            border: 'none',
                            color: 'white',
                            marginTop: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}

                        onClick={() => handleFileClick(fileFolderData)}
                    >
                        <FileIcon extension={handleExtension(fileFolderData.name)} size={16} />
                        {fileFolderData.name}
                    </div>
                )}
                
                {isFolder(fileFolderData) && isOpen[fileFolderData.name] && (
                    fileFolderData.children.map((child) => (
                        <TreeNode fileFolderData={child} key={child.name} />
                    ))
                )}
            </div>
        )
    );
}
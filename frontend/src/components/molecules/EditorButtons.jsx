import { useActiveFileButtonStore } from "@/store/activeFileButtonStore";
import EditorButton from "../atoms/EditorButton/EditorButton";
import { useEffect } from "react";
import { useEditorSocketStore } from "@/store/editorSocketStore";

export function EditorButtons () {
    const { activeFileList, removeActiveFileList, count, dec, maxCount, setMaxCount, setCount } = useActiveFileButtonStore();
    const { editorSocket } = useEditorSocketStore();

    function removeFileTab (value) {
        console.log(value);

        
        activeFileList.map((ele) => {
            if(ele.id === value) {
                if(ele.number === count) {
                    activeFileList.map((ele) => {
                        if(ele.number == maxCount-1) {
                            console.log(ele.path);
                            editorSocket.emit('readFile', {
                                pathToFileOrFolder: ele.path
                            });
                        }
                    });
                    dec();
                }
                console.log(ele.number);
            }
        });
        removeActiveFileList(value);
        
        console.log(count);        
    }

    function showFileInEditor (path, fileName) {
        editorSocket.emit('readFile', {
            pathToFileOrFolder: path
        });
        activeFileList.map((ele) => {
            if(ele.id == fileName) {
                ele.number = maxCount + 1;
                setCount(ele.number);
                setMaxCount(ele.number);
            }  
        })
    }

    useEffect(() => {
        let max = 0;
        activeFileList.map((ele) => {
            if(ele.number > max) max = ele.number;
        })
        setMaxCount(max);
        console.log(maxCount, count);
    }, [activeFileList, setMaxCount, maxCount, count])


    return (
        (activeFileList.length && (
            activeFileList.map((ele, key) => (
                ele.number == maxCount ? (
                <EditorButton fileName={ele.id} path={ele.path} isActive={true} handleClickDelete={removeFileTab} key={ele.id} handleFileNameClick={showFileInEditor}/>
                ) 
                :
                <EditorButton fileName={ele.id} path={ele.path} isActive={false} handleClickDelete={removeFileTab} key={ele.id} handleFileNameClick={showFileInEditor}/>
            ))
        ))
    )
}
import { EditorButtons } from "@/components/molecules/EditorButtons";
import EditorComponent from "@/components/molecules/EditorComponent";
import { TreeStructure } from "@/components/organisms/TreeStructure/TreeStructure";
import { useActiveFileButtonStore } from "@/store/activeFileButtonStore";
import { useEditorSocketStore } from "@/store/editorSocketStore";
import { useTreeStructureStore } from "@/store/treeStructureStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { BrowserTerminal } from "@/components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "@/store/terminalSocketStore";
import { Browser } from "@/components/organisms/Browser/Browser";

export default function ProjectPlayGround () {
    const { projectId: projectIdFromURL } = useParams();

    const { setProjectId, projectId } = useTreeStructureStore();

    const { setEditorSocket, editorSocket} = useEditorSocketStore();

    const { maxCount } = useActiveFileButtonStore();

    const { terminalSocket, setTerminalSocket} = useTerminalSocketStore();

    function fetchPort () {
        console.log(editorSocket);
        editorSocket?.emit("getPort", { containerName: projectIdFromURL});
        console.log("fetching port");
        
    }

    useEffect(() => {
        if(projectIdFromURL) {
            setProjectId(projectIdFromURL);
            var editorSocketConnections = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, 
                {
                    query: `projectId=${projectIdFromURL}`
                }
            );
            

            const ws = new WebSocket("ws://localhost:4000/terminal?projectId="+projectIdFromURL);
            setTerminalSocket(ws);
            setEditorSocket(editorSocketConnections);
            
        }

        // if(terminalSocket) {
        //     editorSocket?.emit("getPort", { containerName: projectIdFromURL});
        // }
        console.log(projectIdFromURL);
        
    }, [setProjectId, projectIdFromURL,setEditorSocket, setTerminalSocket])

    return (
        <>  
            <div style={{ display: 'flex' }}>
                { projectId && (
                <div
                    style={{
                        height: '100vh',
                        width: '17 vw',
                        paddingLeft: '15px',
                        backgroundColor: '#0c1017'
                    }}
                >
                    <TreeStructure /> 
                </div>
                )}
                <div
                    style={{
                            height: '10em',
                            width: '100vw',
                            }}
                >     
                    {maxCount > 0 &&
                        (<div
                        style={{
                            backgroundColor: "black",
                            height: '40px'
                        }}
                    >
                        <EditorButtons />
                    </div>)}
                    <div>
                        <EditorComponent />
                    </div>
                    
                    <div>
                        <button onClick={fetchPort}>GET PORT</button>
                        <BrowserTerminal />
                    </div>
                    <div>
                        {projectIdFromURL && terminalSocket && <Browser projectId={projectIdFromURL}/>}
                    </div>
                </div>
                
                
            </div>
            
        </>
        
    )
}
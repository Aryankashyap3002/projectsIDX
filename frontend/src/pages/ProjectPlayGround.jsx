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

export default function ProjectPlayGround () {
    const { projectId: projectIdFromURL } = useParams();

    const { setProjectId, projectId } = useTreeStructureStore();

    const { setEditorSocket } = useEditorSocketStore();

    const { maxCount } = useActiveFileButtonStore();

    const { setTerminalSocket} = useTerminalSocketStore();

    useEffect(() => {
        if(projectIdFromURL) {
            setProjectId(projectIdFromURL);
            var editorSocketConnections = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, 
                {
                    query: `projectId=${projectIdFromURL}`
                }
            );
            setEditorSocket(editorSocketConnections);

            const ws = new WebSocket("ws://localhost:3000/terminal?projectId="+projectIdFromURL);
            setTerminalSocket(ws)
        }
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
                        <BrowserTerminal />
                    </div>
                </div>
                
                
            </div>
            
        </>
        
    )
}
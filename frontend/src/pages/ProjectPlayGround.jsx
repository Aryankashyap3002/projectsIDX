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
        <div className="flex h-screen w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden">
            {/* Left Sidebar - File Tree */}
            {projectId && (
                <div className="w-80 min-w-[300px] max-w-[400px] h-full bg-slate-950/90 backdrop-blur-sm border-r border-slate-700/50 shadow-2xl">
                    <div className="h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                        <TreeStructure />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 h-full flex flex-col">
                {/* Editor Section */}
                <div className="h-[calc(100vh-320px)] flex flex-col bg-slate-900/80 backdrop-blur-sm">
                    {/* Editor Tabs */}
                    {maxCount > 0 && (
                        <div style={{
                            backgroundColor: "black",
                            height: '40px'
                        }}>
                            <EditorButtons />
                        </div>
                    )}

                    {/* Editor Component */}
                    <div className="flex-1 min-h-0 bg-slate-900/90 backdrop-blur-sm border border-slate-700/30 rounded-tl-lg shadow-inner">
                        <EditorComponent />
                    </div>
                </div>

                {/* Terminal Section */}
                <div className="h-80 bg-slate-950/95 backdrop-blur-sm border-t border-slate-700/50 shadow-2xl">
                    <div className="h-full flex flex-col">
                        {/* Terminal Header */}
                        <div className="h-12 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 flex items-center px-4 shadow-lg">
                            <button 
                                onClick={fetchPort}
                                className="px-4 py-2 bg-blue-600/80 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-blue-500/30"
                            >
                                GET PORT
                            </button>
                            <div className="ml-4 text-slate-400 text-sm font-medium">Terminal</div>
                        </div>
                        
                        {/* Terminal Content */}
                        <div className="h-[calc(100%-48px)] overflow-hidden">
                            <BrowserTerminal />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Browser */}
            <div className="w-96 min-w-[350px] max-w-[600px] h-full bg-slate-950/90 backdrop-blur-sm border-l border-slate-700/50 shadow-2xl">
                <div className="h-full flex flex-col">
                    {/* Browser Header */}
                    <div className="h-14 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 flex items-center px-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                        </div>
                        <div className="ml-4 text-slate-300 text-sm font-medium">Browser Preview</div>
                    </div>
                    
                    {/* Browser Content */}
                    <div className="flex-1 overflow-hidden bg-white/5 backdrop-blur-sm">
                        {projectIdFromURL && terminalSocket ? (
                            <Browser projectId={projectIdFromURL} />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                        </svg>
                                    </div>
                                    <h3 className="text-slate-300 text-lg font-medium mb-2">Browser Preview</h3>
                                    <p className="text-slate-500 text-sm">
                                        {!projectIdFromURL ? "No project loaded" : "Waiting for terminal connection..."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
import { EditorButtons } from "@/components/molecules/EditorButtons";
import EditorComponent from "@/components/molecules/EditorComponent";
import { TreeStructure } from "@/components/organisms/TreeStructure/TreeStructure";
import { useActiveFileButtonStore } from "@/store/activeFileButtonStore";
import { useEditorSocketStore } from "@/store/editorSocketStore";
import { useTreeStructureStore } from "@/store/treeStructureStore";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { BrowserTerminal } from "@/components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "@/store/terminalSocketStore";
import { Browser } from "@/components/organisms/Browser/Browser";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function ProjectPlayGround() {
    const { projectId: projectIdFromURL } = useParams();
    const { setProjectId, projectId } = useTreeStructureStore();
    const { setEditorSocket, editorSocket } = useEditorSocketStore();
    const { maxCount } = useActiveFileButtonStore();
    const { terminalSocket, setTerminalSocket } = useTerminalSocketStore();

    // State for panel widths
    const [treeWidth, setTreeWidth] = useState(300);
    const [browserWidth, setBrowserWidth] = useState(400);
    const [terminalHeight, setTerminalHeight] = useState(0);
    
    // Browser control states
    const [isBrowserMinimized, setIsBrowserMinimized] = useState(false);
    const [isBrowserMaximized, setIsBrowserMaximized] = useState(false);
    const [isBrowserClosed, setIsBrowserClosed] = useState(false);
    const [browserBeforeMaximize, setBrowserBeforeMaximize] = useState(400);
    
    const containerRef = useRef(null);
    const isResizing = useRef(false);

    function fetchPort() {
        console.log(editorSocket);
        editorSocket?.emit("getPort", { containerName: projectIdFromURL });
        console.log("fetching port");
    }

    useEffect(() => {
        if (projectIdFromURL) {
            setProjectId(projectIdFromURL);
            var editorSocketConnections = io(`${import.meta.env.VITE_BACKEND_URL}/editor`,
                {
                    query: `projectId=${projectIdFromURL}`
                }
            );

            const ws = new WebSocket("ws://localhost:4000/terminal?projectId=" + projectIdFromURL);
            setTerminalSocket(ws);
            setEditorSocket(editorSocketConnections);
        }
    }, [setProjectId, projectIdFromURL, setEditorSocket, setTerminalSocket]);

    // Tree resize handler
    const handleTreeResize = (e) => {
        if (!isResizing.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.max(200, Math.min(500, e.clientX - containerRect.left));
        setTreeWidth(newWidth);
    };

    // Browser resize handler
    const handleBrowserResize = (e) => {
        if (!isResizing.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.max(300, Math.min(600, containerRect.right - e.clientX));
        setBrowserWidth(newWidth);
    };

    // Browser control handlers
    const handleBrowserClose = () => {
        setIsBrowserClosed(true);
        setIsBrowserMinimized(false);
        setIsBrowserMaximized(false);
        setBrowserWidth(0);
    };

    const handleBrowserRestore = () => {
        setIsBrowserClosed(false);
        setIsBrowserMinimized(false);
        setIsBrowserMaximized(false);
        setBrowserWidth(400); // Default width
    };

    const handleBrowserMinimize = () => {
        if (isBrowserMinimized) {
            // Restore from minimized
            setIsBrowserMinimized(false);
            setBrowserWidth(isBrowserMaximized ? window.innerWidth * 0.6 : browserBeforeMaximize);
        } else {
            // Minimize
            setIsBrowserMinimized(true);
            setBrowserBeforeMaximize(browserWidth);
            setBrowserWidth(60); // Just show the header
        }
    };

    const handleBrowserMaximize = () => {
        if (isBrowserMaximized) {
            // Restore from maximized
            setIsBrowserMaximized(false);
            setBrowserWidth(browserBeforeMaximize);
        } else {
            // Maximize
            setIsBrowserMaximized(true);
            setBrowserBeforeMaximize(browserWidth);
            setBrowserWidth(window.innerWidth * 0.6); // Take 60% of screen
        }
        setIsBrowserMinimized(false);
    };

    // Mouse event handlers
    const startTreeResize = () => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleTreeResize);
        document.addEventListener('mouseup', stopResize);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const startBrowserResize = () => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleBrowserResize);
        document.addEventListener('mouseup', stopResize);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const stopResize = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleTreeResize);
        document.removeEventListener('mousemove', handleBrowserResize);
        document.removeEventListener('mouseup', stopResize);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    const editorWidth = `calc(100vw - ${treeWidth}px - ${browserWidth}px - 8px)`; // 8px for resize handles

    return (
        <div 
            ref={containerRef}
            className="h-screen w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden flex"
        >
            {/* TreeStructure - Fixed width */}
            {projectId && (
                <>
                    <div 
                        style={{ width: `${treeWidth}px` }}
                        className="bg-slate-950/90 backdrop-blur-sm border-r border-slate-700/50 shadow-2xl flex-shrink-0"
                    >
                        <div className="h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                            <TreeStructure />
                        </div>
                    </div>
                    
                    {/* Tree resize handle */}
                    <div 
                        onMouseDown={startTreeResize}
                        className="w-1 bg-slate-700/50 hover:bg-slate-600 transition-colors cursor-col-resize flex-shrink-0"
                    />
                </>
            )}

            {/* Main Content Area - Editor + Terminal - Flexible width */}
            <div 
                style={{ width: editorWidth }}
                className="flex flex-col flex-shrink-0"
            >
                {/* Vertical Terminal Resizing */}
                <ResizablePanelGroup direction="vertical" className="h-full">
                    {/* Editor Section */}
                    <ResizablePanel defaultSize={100} minSize={20}>
                        <div className="h-full flex flex-col bg-slate-900/80 backdrop-blur-sm">
                            {/* Editor Tabs */}
                            {maxCount > 0 && (
                                <div style={{
                                    backgroundColor: "black",
                                    height: '50px',
                                }}>
                                    <EditorButtons />
                                </div>
                            )}

                            {/* Editor Component */}
                            <div className="flex-1 min-h-0 bg-slate-900/90 backdrop-blur-sm border border-slate-700/30 rounded-tl-lg shadow-inner">
                                <EditorComponent />
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle className="h-1 bg-slate-700/50 hover:bg-slate-600 transition-colors" />

                    {/* Terminal Section */}
                    <ResizablePanel defaultSize={0} minSize={0} maxSize={80}>
                        <div className="h-full bg-slate-950/95 backdrop-blur-sm border-t border-slate-700/50 shadow-2xl">
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
                                <div className="flex-1 overflow-hidden">
                                    <BrowserTerminal />
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* Browser resize handle - only show if browser is not closed */}
            {!isBrowserClosed && (
                <div 
                    onMouseDown={startBrowserResize}
                    className="w-1 bg-slate-700/50 hover:bg-slate-600 transition-colors cursor-col-resize flex-shrink-0"
                />
            )}

            {/* Browser Panel or Restore Button */}
            {!isBrowserClosed ? (
                <div 
                    style={{ width: `${browserWidth}px` }}
                    className="bg-slate-950/90 backdrop-blur-sm border-l border-slate-700/50 shadow-2xl flex-shrink-0"
                >
                    <div className="h-full flex flex-col">
                        {/* Browser Header */}
                        <div className="h-14 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 flex items-center px-4 shadow-lg">
                            <div className="flex items-center gap-3">
                                {/* Close Button - Red */}
                                <div 
                                    onClick={handleBrowserClose}
                                    className="w-3 h-3 bg-red-500 rounded-full shadow-sm cursor-pointer hover:bg-red-400 transition-colors flex items-center justify-center group"
                                    title="Close Browser"
                                >
                                    <span className="text-red-900 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                                </div>
                                
                                {/* Minimize Button - Yellow */}
                                <div 
                                    onClick={handleBrowserMinimize}
                                    className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm cursor-pointer hover:bg-yellow-400 transition-colors flex items-center justify-center group"
                                    title={isBrowserMinimized ? "Restore Browser" : "Minimize Browser"}
                                >
                                    <span className="text-yellow-900 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">−</span>
                                </div>
                                
                                {/* Maximize Button - Green */}
                                <div 
                                    onClick={handleBrowserMaximize}
                                    className="w-3 h-3 bg-green-500 rounded-full shadow-sm cursor-pointer hover:bg-green-400 transition-colors flex items-center justify-center group"
                                    title={isBrowserMaximized ? "Restore Browser" : "Maximize Browser"}
                                >
                                    <span className="text-green-900 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isBrowserMaximized ? "□" : "+"}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4 text-slate-300 text-sm font-medium">
                                Browser Preview {isBrowserMinimized && "(Minimized)"} {isBrowserMaximized && "(Maximized)"}
                            </div>
                        </div>
                        
                        {/* Browser Content */}
                        <div className={`flex-1 overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300 ${isBrowserMinimized ? 'opacity-0 h-0' : 'opacity-100'}`}>
                            {projectIdFromURL && terminalSocket && !isBrowserMinimized ? (
                                <Browser projectId={projectIdFromURL} />
                            ) : !isBrowserMinimized ? (
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
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : (
                /* Browser Restore Button - Shows when browser is closed */
                <div className="fixed top-4 right-4 z-50">
                    <button 
                        onClick={handleBrowserRestore}
                        className="bg-slate-800/90 hover:bg-slate-700 border border-slate-600/50 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl transition-all duration-200 hover:shadow-2xl transform hover:scale-105 group"
                        title="Restore Browser Panel"
                    >
                        <div className="flex items-center gap-2 text-slate-300">
                            <svg className="w-5 h-5 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium group-hover:text-white transition-colors">Show Browser</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
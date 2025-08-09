import { EditorButtons } from "@/components/molecules/EditorButtons";
import EditorComponent from "@/components/molecules/EditorComponent";
import { TreeStructure } from "@/components/organisms/TreeStructure/TreeStructure";
import { useActiveFileButtonStore } from "@/store/activeFileButtonStore";
import { useEditorSocketStore } from "@/store/editorSocketStore";
import { useTreeStructureStore } from "@/store/treeStructureStore";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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

    // Optimized state management
    const [panelSizes, setPanelSizes] = useState({
        tree: 300,
        browser: 400,
        terminal: 0
    });
    
    const [browserState, setBrowserState] = useState({
        isMinimized: false,
        isMaximized: false,
        isClosed: false,
        beforeMaximize: 400
    });
    
    const containerRef = useRef(null);
    const isResizing = useRef(false);

    // Memoize socket connection to prevent unnecessary re-renders
    const socketConnection = useMemo(() => {
        if (!projectIdFromURL) return null;
        
        return {
            editor: io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: `projectId=${projectIdFromURL}`
            }),
            terminal: new WebSocket(`ws://localhost:4000/terminal?projectId=${projectIdFromURL}`)
        };
    }, [projectIdFromURL]);

    // Optimized fetch port function
    const fetchPort = useCallback(() => {
        if (editorSocket) {
            editorSocket.emit("getPort", { containerName: projectIdFromURL });
        }
    }, [editorSocket, projectIdFromURL]);

    // Initialize connections only once
    useEffect(() => {
        if (projectIdFromURL && socketConnection) {
            setProjectId(projectIdFromURL);
            setEditorSocket(socketConnection.editor);
            setTerminalSocket(socketConnection.terminal);
        }

        // Cleanup on unmount
        return () => {
            if (socketConnection?.editor) {
                socketConnection.editor.disconnect();
            }
            if (socketConnection?.terminal) {
                socketConnection.terminal.close();
            }
        };
    }, [projectIdFromURL, socketConnection, setProjectId, setEditorSocket, setTerminalSocket]);

    // Optimized resize handlers with useCallback
    const handleTreeResize = useCallback((e) => {
        if (!isResizing.current || !containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.max(200, Math.min(500, e.clientX - containerRect.left));
        setPanelSizes(prev => ({ ...prev, tree: newWidth }));
    }, []);

    const handleBrowserResize = useCallback((e) => {
        if (!isResizing.current || !containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.max(300, Math.min(600, containerRect.right - e.clientX));
        setPanelSizes(prev => ({ ...prev, browser: newWidth }));
    }, []);

    // Optimized browser control handlers
    const handleBrowserClose = useCallback(() => {
        setBrowserState({
            isMinimized: false,
            isMaximized: false,
            isClosed: true,
            beforeMaximize: browserState.beforeMaximize
        });
        setPanelSizes(prev => ({ ...prev, browser: 0 }));
    }, [browserState.beforeMaximize]);

    const handleBrowserRestore = useCallback(() => {
        setBrowserState({
            isMinimized: false,
            isMaximized: false,
            isClosed: false,
            beforeMaximize: 400
        });
        setPanelSizes(prev => ({ ...prev, browser: 400 }));
    }, []);

    const handleBrowserMinimize = useCallback(() => {
        setBrowserState(prev => {
            const newMinimized = !prev.isMinimized;
            setPanelSizes(sizes => ({ 
                ...sizes, 
                browser: newMinimized ? 60 : (prev.isMaximized ? window.innerWidth * 0.6 : prev.beforeMaximize)
            }));
            
            return {
                ...prev,
                isMinimized: newMinimized,
                beforeMaximize: newMinimized ? panelSizes.browser : prev.beforeMaximize
            };
        });
    }, [panelSizes.browser]);

    const handleBrowserMaximize = useCallback(() => {
        setBrowserState(prev => {
            const newMaximized = !prev.isMaximized;
            setPanelSizes(sizes => ({ 
                ...sizes, 
                browser: newMaximized ? window.innerWidth * 0.6 : prev.beforeMaximize
            }));
            
            return {
                ...prev,
                isMaximized: newMaximized,
                isMinimized: false,
                beforeMaximize: newMaximized ? panelSizes.browser : prev.beforeMaximize
            };
        });
    }, [panelSizes.browser]);

    // Optimized mouse event handlers
    const startResize = useCallback((type) => {
        isResizing.current = true;
        const handler = type === 'tree' ? handleTreeResize : handleBrowserResize;
        
        document.addEventListener('mousemove', handler);
        document.addEventListener('mouseup', stopResize);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, [handleTreeResize, handleBrowserResize]);

    const stopResize = useCallback(() => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleTreeResize);
        document.removeEventListener('mousemove', handleBrowserResize);
        document.removeEventListener('mouseup', stopResize);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, [handleTreeResize, handleBrowserResize]);

    // Memoize calculated widths
    const editorWidth = useMemo(() => 
        `calc(100vw - ${panelSizes.tree}px - ${panelSizes.browser}px - 8px)`,
        [panelSizes.tree, panelSizes.browser]
    );

    // Memoize browser controls
    const browserControls = useMemo(() => (
        <div className="flex items-center gap-3">
            <div 
                onClick={handleBrowserClose}
                className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-400 transition-colors"
                title="Close Browser"
            />
            <div 
                onClick={handleBrowserMinimize}
                className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors"
                title={browserState.isMinimized ? "Restore Browser" : "Minimize Browser"}
            />
            <div 
                onClick={handleBrowserMaximize}
                className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-400 transition-colors"
                title={browserState.isMaximized ? "Restore Browser" : "Maximize Browser"}
            />
        </div>
    ), [handleBrowserClose, handleBrowserMinimize, handleBrowserMaximize, browserState.isMinimized, browserState.isMaximized]);

    return (
        <div 
            ref={containerRef}
            className="h-screen w-screen bg-slate-900 overflow-hidden flex"
        >
            {/* TreeStructure */}
            {projectId && (
                <>
                    <div 
                        style={{ width: `${panelSizes.tree}px` }}
                        className="bg-slate-950 border-r border-slate-700 flex-shrink-0"
                    >
                        <div className="h-full p-4 overflow-y-auto">
                            <TreeStructure />
                        </div>
                    </div>
                    
                    <div 
                        onMouseDown={() => startResize('tree')}
                        className="w-1 bg-slate-700 hover:bg-slate-600 cursor-col-resize flex-shrink-0"
                    />
                </>
            )}

            {/* Main Content Area */}
            <div 
                style={{ width: editorWidth }}
                className="flex flex-col flex-shrink-0"
            >
                <ResizablePanelGroup direction="vertical" className="h-full">
                    <ResizablePanel defaultSize={100} minSize={20}>
                        <div className="h-full flex flex-col bg-slate-900">
                            {maxCount > 0 && (
                                <div className="bg-black h-12">
                                    <EditorButtons />
                                </div>
                            )}
                            <div className="flex-1 min-h-0 bg-slate-900 border border-slate-700 rounded-tl-lg">
                                <EditorComponent />
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle className="h-1 bg-slate-700 hover:bg-slate-600" />

                    <ResizablePanel defaultSize={0} minSize={0} maxSize={80}>
                        <div className="h-full bg-slate-950 border-t border-slate-700">
                            <div className="h-full flex flex-col">
                                <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4">
                                    <button 
                                        onClick={fetchPort}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                                    >
                                        GET PORT
                                    </button>
                                    <div className="ml-4 text-slate-400 text-sm">Terminal</div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <BrowserTerminal />
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* Browser resize handle */}
            {!browserState.isClosed && (
                <div 
                    onMouseDown={() => startResize('browser')}
                    className="w-1 bg-slate-700 hover:bg-slate-600 cursor-col-resize flex-shrink-0"
                />
            )}

            {/* Browser Panel */}
            {!browserState.isClosed ? (
                <div 
                    style={{ width: `${panelSizes.browser}px` }}
                    className="bg-slate-950 border-l border-slate-700 flex-shrink-0"
                >
                    <div className="h-full flex flex-col">
                        <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center px-4">
                            {browserControls}
                            <div className="ml-4 text-slate-300 text-sm">
                                Browser Preview 
                                {browserState.isMinimized && " (Minimized)"}
                                {browserState.isMaximized && " (Maximized)"}
                            </div>
                        </div>
                        
                        <div className={`flex-1 overflow-hidden bg-white/5 transition-all duration-200 ${
                            browserState.isMinimized ? 'opacity-0 h-0' : 'opacity-100'
                        }`}>
                            {projectIdFromURL && terminalSocket && !browserState.isMinimized ? (
                                <Browser projectId={projectIdFromURL} />
                            ) : !browserState.isMinimized ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                            </svg>
                                        </div>
                                        <h3 className="text-slate-300 text-lg mb-2">Browser Preview</h3>
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
                <div className="fixed top-4 right-4 z-50">
                    <button 
                        onClick={handleBrowserRestore}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg transition-colors"
                        title="Restore Browser Panel"
                    >
                        <div className="flex items-center gap-2 text-slate-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">Show Browser</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
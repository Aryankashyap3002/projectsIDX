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
import './ProjectPlayGround.css';

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
        document.body.classList.add('user-select-none');
    }, [handleTreeResize, handleBrowserResize]);

    const stopResize = useCallback(() => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleTreeResize);
        document.removeEventListener('mousemove', handleBrowserResize);
        document.removeEventListener('mouseup', stopResize);
        document.body.style.cursor = '';
        document.body.classList.remove('user-select-none');
    }, [handleTreeResize, handleBrowserResize]);

    // Memoize calculated widths
    const editorWidth = useMemo(() => 
        `calc(100vw - ${panelSizes.tree}px - ${panelSizes.browser}px - 8px)`,
        [panelSizes.tree, panelSizes.browser]
    );

    // Memoize browser controls
    const browserControls = useMemo(() => (
        <div className="browser-controls">
            <div 
                onClick={handleBrowserClose}
                className="browser-control-btn browser-control-close"
                title="Close Browser"
            />
            <div 
                onClick={handleBrowserMinimize}
                className="browser-control-btn browser-control-minimize"
                title={browserState.isMinimized ? "Restore Browser" : "Minimize Browser"}
            />
            <div 
                onClick={handleBrowserMaximize}
                className="browser-control-btn browser-control-maximize"
                title={browserState.isMaximized ? "Restore Browser" : "Maximize Browser"}
            />
        </div>
    ), [handleBrowserClose, handleBrowserMinimize, handleBrowserMaximize, browserState.isMinimized, browserState.isMaximized]);

    return (
        <div 
            ref={containerRef}
            className="playground-container"
        >
            {/* TreeStructure */}
            {projectId && (
                <>
                    <div 
                        style={{ width: `${panelSizes.tree}px` }}
                        className="tree-panel"
                    >
                        <div className="tree-content">
                            <TreeStructure />
                        </div>
                    </div>
                    
                    <div 
                        onMouseDown={() => startResize('tree')}
                        className="resize-handle"
                    />
                </>
            )}

            {/* Main Content Area */}
            <div 
                style={{ width: editorWidth }}
                className="main-editor-area"
            >
                <ResizablePanelGroup direction="vertical" className="h-full">
                    <ResizablePanel defaultSize={100} minSize={20}>
                        <div className="editor-container">
                            {maxCount > 0 && (
                                <div className="editor-buttons-bar">
                                    <EditorButtons />
                                </div>
                            )}
                            <div className="editor-content">
                                <EditorComponent />
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle className="resizable-handle-horizontal" />

                    <ResizablePanel defaultSize={0} minSize={0} maxSize={80}>
                        <div className="terminal-panel">
                            <div className="terminal-container">
                                <div className="terminal-header">
                                    <button 
                                        onClick={fetchPort}
                                        className="terminal-get-port-btn"
                                    >
                                        GET PORT
                                    </button>
                                    <div className="terminal-title">Terminal</div>
                                </div>
                                <div className="terminal-content">
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
                    className="resize-handle"
                />
            )}

            {/* Browser Panel */}
            {!browserState.isClosed ? (
                <div 
                    style={{ width: `${panelSizes.browser}px` }}
                    className="browser-panel"
                >
                    <div className="browser-container">
                        <div className="browser-header">
                            {browserControls}
                            <div className="browser-title">
                                Browser Preview 
                                {browserState.isMinimized && " (Minimized)"}
                                {browserState.isMaximized && " (Maximized)"}
                            </div>
                        </div>
                        
                        <div className={`browser-content ${
                            browserState.isMinimized ? 'minimized' : 'normal'
                        }`}>
                            {projectIdFromURL && terminalSocket && !browserState.isMinimized ? (
                                <Browser projectId={projectIdFromURL} />
                            ) : !browserState.isMinimized ? (
                                <div className="browser-placeholder">
                                    <div className="browser-placeholder-content">
                                        <div className="browser-placeholder-icon">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                            </svg>
                                        </div>
                                        <h3 className="browser-placeholder-title">Browser Preview</h3>
                                        <p className="browser-placeholder-text">
                                            {!projectIdFromURL ? "No project loaded" : "Waiting for terminal connection..."}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="restore-button">
                    <button 
                        onClick={handleBrowserRestore}
                        className="restore-button-content"
                        title="Restore Browser Panel"
                    >
                        <div className="restore-button-inner">
                            <svg className="restore-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="restore-button-text">Show Browser</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
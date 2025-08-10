import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useTreeStructureStore } from "@/store/treeStructureStore";
import { useSocketConnections } from "@/hooks/useSocketConnections";
import { usePanelResize } from "@/hooks/usePanelResize";
import { useBrowserState } from "@/hooks/useBrowserState";
import { TreePanel } from "@/components/atoms/TreePanel/TreePanel";
import { EditorArea } from "@/components/atoms/EditorArea/EditorArea";
import { BrowserPanel } from "@/components/atoms/BrowserPanel/BrowserPanel";
import './ProjectPlayGround.css';

export default function ProjectPlayGround() {
  const { projectId: projectIdFromURL } = useParams();
  const { setProjectId, projectId } = useTreeStructureStore();
  
  // Custom hooks
  const { terminalSocket, fetchPort } = useSocketConnections(projectIdFromURL);
  const { panelSizes, setPanelSizes, containerRef, startResize } = usePanelResize();
  const {
    browserState,
    handleBrowserClose,
    handleBrowserRestore,
    handleBrowserMinimize,
    handleBrowserMaximize
  } = useBrowserState(panelSizes, setPanelSizes);

  // Set project ID when component mounts
  useEffect(() => {
    if (projectIdFromURL) {
      setProjectId(projectIdFromURL);
    }
  }, [projectIdFromURL, setProjectId]);

  // Calculate editor width
  const editorWidth = useMemo(() => 
    `calc(100vw - ${panelSizes.tree}px - ${panelSizes.browser}px - 8px)`,
    [panelSizes.tree, panelSizes.browser]
  );

  return (
    <div 
      ref={containerRef}
      className="playground-container"
    >
      {/* Tree Structure Panel */}
      {projectId && (
        <TreePanel 
          width={panelSizes.tree}
          onResizeStart={startResize}
        />
      )}

      {/* Editor Area */}
      <EditorArea 
        width={editorWidth}
        onFetchPort={fetchPort}
      />

      {/* Browser Panel */}
      <BrowserPanel
        width={panelSizes.browser}
        browserState={browserState}
        projectId={projectIdFromURL}
        terminalSocket={terminalSocket}
        onClose={browserState.isClosed ? handleBrowserRestore : handleBrowserClose}
        onMinimize={handleBrowserMinimize}
        onMaximize={handleBrowserMaximize}
        onResizeStart={startResize}
      />
    </div>
  );
}
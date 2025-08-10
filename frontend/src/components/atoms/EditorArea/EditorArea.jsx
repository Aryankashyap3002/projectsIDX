import { EditorButtons } from "@/components/molecules/EditorButtons";
import EditorComponent from "@/components/molecules/EditorComponent";
import { BrowserTerminal } from "@/components/molecules/BrowserTerminal/BrowserTerminal";
import { useActiveFileButtonStore } from "@/store/activeFileButtonStore";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export const EditorArea = ({ width, onFetchPort }) => {
  const { maxCount } = useActiveFileButtonStore();

  return (
    <div 
      style={{ width }}
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
                  onClick={onFetchPort}
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
  );
};
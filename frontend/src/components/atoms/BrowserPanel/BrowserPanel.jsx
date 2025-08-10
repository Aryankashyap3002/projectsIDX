import { Browser } from "@/components/organisms/Browser/Browser";
import { BrowserControls } from "../BrowserControls/BrowserControls";

export const BrowserPanel = ({
  width,
  browserState,
  projectId,
  terminalSocket,
  onClose,
  onMinimize,
  onMaximize,
  onResizeStart
}) => {
  if (browserState.isClosed) {
    return (
      <div className="restore-button">
        <button 
          onClick={onClose}
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
    );
  }

  return (
    <>
      <div 
        onMouseDown={() => onResizeStart('browser')}
        className="resize-handle"
      />
      
      <div 
        style={{ width: `${width}px` }}
        className="browser-panel"
      >
        <div className="browser-container">
          <div className="browser-header">
            <BrowserControls
              onClose={onClose}
              onMinimize={onMinimize}
              onMaximize={onMaximize}
              isMinimized={browserState.isMinimized}
              isMaximized={browserState.isMaximized}
            />
            <div className="browser-title">
              Browser Preview 
              {browserState.isMinimized && " (Minimized)"}
              {browserState.isMaximized && " (Maximized)"}
            </div>
          </div>
          
          <div className={`browser-content ${
            browserState.isMinimized ? 'minimized' : 'normal'
          }`}>
            {projectId && terminalSocket && !browserState.isMinimized ? (
              <Browser projectId={projectId} />
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
                    {!projectId ? "No project loaded" : "Waiting for terminal connection..."}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
import { useMemo } from "react";

export const BrowserControls = ({
  onClose,
  onMinimize,
  onMaximize,
  isMinimized,
  isMaximized
}) => {
  const controls = useMemo(() => (
    <div className="browser-controls">
      <div 
        onClick={onClose}
        className="browser-control-btn browser-control-close"
        title="Close Browser"
      />
      <div 
        onClick={onMinimize}
        className="browser-control-btn browser-control-minimize"
        title={isMinimized ? "Restore Browser" : "Minimize Browser"}
      />
      <div 
        onClick={onMaximize}
        className="browser-control-btn browser-control-maximize"
        title={isMaximized ? "Restore Browser" : "Maximize Browser"}
      />
    </div>
  ), [onClose, onMinimize, onMaximize, isMinimized, isMaximized]);

  return controls;
};
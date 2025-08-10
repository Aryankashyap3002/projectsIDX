import { useState, useRef, useCallback } from "react";

export const usePanelResize = () => {
  const [panelSizes, setPanelSizes] = useState({
    tree: 300,
    browser: 400,
    terminal: 0
  });

  const containerRef = useRef(null);
  const isResizing = useRef(false);

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

  return {
    panelSizes,
    setPanelSizes,
    containerRef,
    startResize,
    stopResize
  };
};
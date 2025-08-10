import { useState, useCallback } from "react";

export const useBrowserState = (panelSizes, setPanelSizes) => {
  const [browserState, setBrowserState] = useState({
    isMinimized: false,
    isMaximized: false,
    isClosed: false,
    beforeMaximize: 400
  });

  const handleBrowserClose = useCallback(() => {
    setBrowserState({
      isMinimized: false,
      isMaximized: false,
      isClosed: true,
      beforeMaximize: browserState.beforeMaximize
    });
    setPanelSizes(prev => ({ ...prev, browser: 0 }));
  }, [browserState.beforeMaximize, setPanelSizes]);

  const handleBrowserRestore = useCallback(() => {
    setBrowserState({
      isMinimized: false,
      isMaximized: false,
      isClosed: false,
      beforeMaximize: 400
    });
    setPanelSizes(prev => ({ ...prev, browser: 400 }));
  }, [setPanelSizes]);

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
  }, [panelSizes.browser, setPanelSizes]);

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
  }, [panelSizes.browser, setPanelSizes]);

  return {
    browserState,
    handleBrowserClose,
    handleBrowserRestore,
    handleBrowserMinimize,
    handleBrowserMaximize
  };
};
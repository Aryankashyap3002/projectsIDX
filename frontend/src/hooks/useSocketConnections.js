import { useEffect, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import { useEditorSocketStore } from "@/store/editorSocketStore";
import { useTerminalSocketStore } from "@/store/terminalSocketStore";

export const useSocketConnections = (projectId) => {
  const { setEditorSocket, editorSocket } = useEditorSocketStore();
  const { terminalSocket, setTerminalSocket } = useTerminalSocketStore();

  const socketConnection = useMemo(() => {
    if (!projectId) return null;
    
    return {
      editor: io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
        query: `projectId=${projectId}`
      }),
      terminal: new WebSocket(`ws://localhost:4000/terminal?projectId=${projectId}`)
    };
  }, [projectId]);

  const fetchPort = useCallback(() => {
    if (editorSocket) {
      editorSocket.emit("getPort", { containerName: projectId });
    }
  }, [editorSocket, projectId]);

  useEffect(() => {
    if (projectId && socketConnection) {
      setEditorSocket(socketConnection.editor);
      setTerminalSocket(socketConnection.terminal);
    }

    return () => {
      if (socketConnection?.editor) {
        socketConnection.editor.disconnect();
      }
      if (socketConnection?.terminal) {
        socketConnection.terminal.close();
      }
    };
  }, [projectId, socketConnection, setEditorSocket, setTerminalSocket]);

  return { editorSocket, terminalSocket, fetchPort };
};
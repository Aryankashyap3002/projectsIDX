import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStote";
import { usePort } from "./portStore";

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (socket) => {
        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const portSetter = usePort.getState().setPort;
        socket.on("readFileSuccess", (args) => {
            
            activeFileTabSetter(args.path, args.data, args.extension);
        });
        socket.on("writeFileSuccess", (data) => {
            socket.emit("readFile", {
                pathToFileOrFolder: data.path
            });
        })
        set({
            editorSocket: socket
        });

        socket?.on("getPortSuccess", ({ port }) => {
            portSetter(port);
        })
    }
}))
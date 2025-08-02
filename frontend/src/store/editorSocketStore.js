import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStote";
import { usePortStore } from "./portStore";

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (socket) => {
        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const portSetter = usePortStore.getState().setPort;
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
            console.log("port data: ", port)
            portSetter(port);
        });
    }
}));
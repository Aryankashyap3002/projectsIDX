import { create } from "zustand";

export const useActiveFileButtonStore = create((set, get) => ({
    activeFileList: [],
    count: 1,
    maxCount: 0,
    inc: () => set((state) => ({ count: state.count + 1 })),
    dec: () => set((state) => ({ count: state.count - 1 })),
    addActiveFileList: (fileName, path) => {
       set((state) => ({
            activeFileList: [...state.activeFileList, {id: fileName, path: path, number: get().count}]
       }))
    },
    removeActiveFileList: (fileName) => {
        set((state) => ({
            activeFileList: state.activeFileList.filter((ele) => ele.id !== fileName)
        }))
    },
    setCount: (incomingCount) => {
        set({
            count: incomingCount
        })
    },
    setMaxCount: (incomingMaxCount) => {
        set({
            maxCount: incomingMaxCount
        })
    }
}));
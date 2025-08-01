import { create } from "zustand";

export const usePort = create((set) => ({
    port: null,
    setPort: (currPort)  => {
        set({port: currPort});
    }
}))
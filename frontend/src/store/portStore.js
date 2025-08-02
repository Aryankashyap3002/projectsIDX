import { create } from "zustand";

export const usePortStore = create((set) => ({
    port: null,
    setPort: (currPort)  => {
        set({port: currPort});
    }
}))
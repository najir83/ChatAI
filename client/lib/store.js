import { create } from "zustand";
const useStore = create((set, get) => ({
  baseUser:null,
  collections:[],

  setBaseUser: async (u) => {
    set({ baseUser: u });
  },
  setCollection: async (u) => {
    set({ collections: u });
  },
}));

export default useStore;

import { create } from "zustand";
const useStore = create((set, get) => ({
  baseUser: null,
  showItems: false,
  showNav: false,
  collections: [],

  setShowItems: (i) => {
    set({ showItems: i });
  },

  setShowNav: (i) => {
    set({ showNav: i });
  },
  setBaseUser: (u) => {
    set({ baseUser: u });
  },
  setCollection: async (u) => {
    set({ collections: u });
  },
}));

export default useStore;

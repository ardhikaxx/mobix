import { create } from "zustand";

interface UIState {
  isDrawerOpen: boolean;
  activeCategory: string | null;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  setActiveCategory: (slug: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDrawerOpen: false,
  activeCategory: null,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setActiveCategory: (slug) => set({ activeCategory: slug }),
}));

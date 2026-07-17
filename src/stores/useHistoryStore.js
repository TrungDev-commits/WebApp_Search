import { create } from 'zustand'

const useHistoryStore = create((set) => ({
  items: [],
  isLoading: false,

  setItems: (items) => set({ items, isLoading: false }),

  setLoading: (loading) => set({ isLoading: loading }),

  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item._id !== id),
  })),
}))

export default useHistoryStore

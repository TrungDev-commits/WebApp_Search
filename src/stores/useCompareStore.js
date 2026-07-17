import { create } from 'zustand'

const useCompareStore = create((set) => ({
  data: null,
  isLoading: false,
  error: null,

  setData: (data) => set({ data, isLoading: false, error: null }),

  setLoading: (loading) => set({ isLoading: loading, error: null }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () => set({ data: null, isLoading: false, error: null }),
}))

export default useCompareStore

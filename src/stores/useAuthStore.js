import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user, token) => set({
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
  }),

  logout: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  setLoading: (loading) => set({ isLoading: loading }),
}))

export default useAuthStore

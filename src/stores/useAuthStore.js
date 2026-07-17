import { create } from 'zustand'

function decodeToken(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload
  } catch {
    return null
  }
}

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user, token) => {
    localStorage.setItem('auth_token', token)
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  restoreSession: () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const payload = decodeToken(token)
    if (!payload || !payload.sub) {
      localStorage.removeItem('auth_token')
      return
    }
    set({
      user: {
        sub: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
      token,
      isAuthenticated: true,
      isLoading: false,
    })
  },
}))

export default useAuthStore

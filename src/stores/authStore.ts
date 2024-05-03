import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

interface DecodedToken {
  sub: string
  exp: number
}

const API_BASE_URL = 'http://127.0.0.1:3000'

const DEFAULT_ROLE = 'Student'

export const useAuthStore = defineStore('authStoreId', () => {
  const token = ref('')
  const authServiceError = ref('')

  const isLoggedIn = computed(() => !!token.value)

  const getUserId = computed(() => {
    if (!token.value) return ''
    const payload: DecodedToken = jwtDecode(token.value)
    return payload.sub
  })

  const isTokenExpired = computed(() => {
    if (!token.value) return true
    const payload: DecodedToken = jwtDecode(token.value)
    const now = new Date().getTime() / 1000
    return payload.exp < now
  })

  function clearError() {
    authServiceError.value = ''
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('token')
  }

  function loadPersistedToken() {
    const storedToken = localStorage.getItem('token')
    if (storedToken) token.value = storedToken
  }

  async function login(credential: { email: string; password: string }) {
    try {
      clearError()
      const newToken = await authService.getToken(credential)
      if (newToken) {
        token.value = newToken
        localStorage.setItem('token', token.value)
      }
    } catch (error: any) {
      authServiceError.value = error.message || 'Unknown error'
    }
  }

  async function register(credential: { email: string; password: string; name: string }) {
    try {
      clearError()

      const modifiedCredential = { ...credential, role: DEFAULT_ROLE }

      await axios.post(`${API_BASE_URL}/register`, modifiedCredential)
    } catch (error: any) {
      authServiceError.value = error.message || 'Unknown error'
    }
  }

  function refreshToken() {
    logout() // Simplified action for token refresh: logs out the user
  }

  return {
    token,
    authServiceError,
    isLoggedIn,
    getUserId,
    isTokenExpired,
    clearError,
    logout,
    loadPersistedToken,
    login,
    register,
    refreshToken
  }
})

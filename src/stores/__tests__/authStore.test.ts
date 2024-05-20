import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../authStore'
import { authService } from '../../services/authService'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

vi.mock('../../services/authService', () => ({
  authService: {
    getToken: vi.fn()
  }
}))

vi.mock('axios', () => ({
  post: vi.fn()
}))

vi.mock('jwt-decode', () => ({
  default: vi.fn()
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
    localStorage.clear()
  })
  it('devrait se connecter avec succès', async () => {
    const store = useAuthStore()
    const token = 'mocked-token'
    authService.getToken.mockResolvedValueOnce(token)
    ;(jwtDecode as any).mockReturnValueOnce({ sub: '1', exp: Date.now() / 1000 + 3600 })

    await store.login({ email: 'test@example.com', password: 'password' })

    expect(store.token).toBe(token)
    expect(localStorage.getItem('token')).toBe(token)
  })

  it('devrait gérer les erreurs lors de la connexion', async () => {
    const store = useAuthStore()
    const error = new Error('Erreur Réseau')
    authService.getToken.mockRejectedValueOnce(error)

    await store.login({ email: 'test@example.com', password: 'password' })

    expect(store.authServiceError).toBe(error.message)
  })

  it('devrait enregistrer un utilisateur avec succès', async () => {
    const store = useAuthStore()
    ;(axios.post as any).mockResolvedValueOnce({})

    await store.register({ email: 'test@example.com', password: 'password', name: 'John Doe' })

    expect(store.authServiceError).toBe('')
    expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:3000/register', {
      email: 'test@example.com',
      password: 'password',
      name: 'John Doe',
      role: 'Student'
    })
  })

  it("devrait gérer les erreurs lors de l'enregistrement", async () => {
    const store = useAuthStore()
    const error = new Error('Erreur Réseau')
    ;(axios.post as any).mockRejectedValueOnce(error)

    await store.register({ email: 'test@example.com', password: 'password', name: 'John Doe' })

    expect(store.authServiceError).toBe(error.message)
  })

  it('devrait charger le token persistant', () => {
    const store = useAuthStore()
    const token = 'mocked-token'
    localStorage.setItem('token', token)

    store.loadPersistedToken()

    expect(store.token).toBe(token)
  })

  it("devrait déconnecter l'utilisateur", () => {
    const store = useAuthStore()
    const token = 'mocked-token'
    store.token = token
    localStorage.setItem('token', token)

    store.logout()

    expect(store.token).toBe('')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('devrait vérifier si le token est expiré', () => {
    const store = useAuthStore()
    const expiredToken = 'expired-token'
    const validToken = 'valid-token'
    ;(jwtDecode as any)
      .mockReturnValueOnce({ exp: Date.now() / 1000 - 3600 }) // Token expiré
      .mockReturnValueOnce({ exp: Date.now() / 1000 + 3600 }) // Token valide

    store.token = expiredToken
    expect(store.isTokenExpired).toBe(true)

    store.token = validToken
    expect(store.isTokenExpired).toBe(false)
  })

  it("devrait obtenir l'ID de l'utilisateur à partir du token", () => {
    const store = useAuthStore()
    const token = 'valid-token'
    const userId = '1'
    ;(jwtDecode as any).mockReturnValueOnce({ sub: userId })

    store.token = token
    expect(store.getUserId).toBe(userId)
  })
})

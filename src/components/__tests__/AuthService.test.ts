import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../authService'
import axios from 'axios'
import { parseAxiosError } from '../../shared/parseAxiosError'

// Mock axios e parseAxiosError
vi.mock('axios')
vi.mock('../../shared/parseAxiosError')

describe('authService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getToken', () => {
    it('devrait obtenir un token avec succès', async () => {
      const token = 'mocked-token'
      const credentials = { email: 'test@example.com', password: 'password' }
      ;(axios.post as any).mockResolvedValueOnce({ data: { accessToken: token } })

      const result = await authService.getToken(credentials)

      expect(result).toEqual(token)
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:3000/login', {
        email: credentials.email,
        password: credentials.password
      })
    })

    it("devrait gérer les erreurs lors de l'obtention d'un token", async () => {
      const error = new Error('Erreur Réseau')
      const credentials = { email: 'test@example.com', password: 'password' }
      ;(axios.post as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(authService.getToken(credentials)).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })
})

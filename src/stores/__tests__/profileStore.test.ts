import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '../profileStore'
import { userService } from '../../services/userService'
import { useAuthStore } from '../authStore'

vi.mock('../../services/userService', () => ({
  userService: {
    getUserById: vi.fn(),
    getAllUsers: vi.fn(),
    deleteUser: vi.fn(),
    updateUser: vi.fn()
  }
}))

vi.mock('../authStore', () => ({
  useAuthStore: () => ({
    getUserId: '1'
  })
}))

describe('useProfileStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  describe('getProfile', () => {
    it("devrait obtenir le profil de l'utilisateur avec succès", async () => {
      const store = useProfileStore()
      const profile = { email: 'test@example.com', name: 'John Doe', role: 'Student' }
      ;(userService.getUserById as any).mockResolvedValueOnce(profile)

      await store.getProfile()

      expect(store.email).toBe(profile.email)
      expect(store.name).toBe(profile.name)
      expect(store.role).toBe(profile.role)
      expect(store.onError).toBe(false)
    })

    it("devrait gérer les erreurs lors de l'obtention du profil", async () => {
      const store = useProfileStore()
      const error = new Error('Erreur Réseau')
      ;(userService.getUserById as any).mockRejectedValueOnce(error)

      await store.getProfile()

      expect(store.onError).toBe(true)
    })
  })

  describe('getAllStudents', () => {
    it('devrait obtenir tous les étudiants avec succès', async () => {
      const store = useProfileStore()
      const users = [
        { id: '1', role: 'Student' },
        { id: '2', role: 'Teacher' }
      ]
      ;(userService.getAllUsers as any).mockResolvedValueOnce(users)

      const result = await store.getAllStudents()

      expect(result).toEqual([{ id: '1', role: 'Student' }])
      expect(store.onError).toBe(false)
    })
  })
})

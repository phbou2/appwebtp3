import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from '../userService'
import axiosAuth from '../../shared/axiosAuth'
import { parseAxiosError } from '../../shared/parseAxiosError'

// Mock axiosAuth e parseAxiosError
vi.mock('../../shared/axiosAuth', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn()
  }
}))

vi.mock('../../shared/parseAxiosError')

describe('userService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getUserById', () => {
    it('devrait obtenir un utilisateur par ID avec succès', async () => {
      const user = { id: '1', name: 'John Doe' }
      ;(axiosAuth.get as any).mockResolvedValueOnce({ data: user })

      const result = await userService.getUserById('1')

      expect(result).toEqual(user)
      expect(axiosAuth.get).toHaveBeenCalledWith('http://127.0.0.1:3000/users/1')
    })

    it("devrait gérer les erreurs lors de l'obtention d'un utilisateur par ID", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.get as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(userService.getUserById('1')).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })

  describe('getAllUsers', () => {
    it('devrait obtenir tous les utilisateurs avec succès', async () => {
      const users = [{ id: '1', name: 'John Doe' }]
      ;(axiosAuth.get as any).mockResolvedValueOnce({ data: users })

      const result = await userService.getAllUsers()

      expect(result).toEqual(users)
      expect(axiosAuth.get).toHaveBeenCalledWith('http://127.0.0.1:3000/users')
    })

    it("devrait gérer les erreurs lors de l'obtention de tous les utilisateurs", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.get as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(userService.getAllUsers()).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteUser', () => {
    it('devrait supprimer un utilisateur avec succès', async () => {
      ;(axiosAuth.delete as any).mockResolvedValueOnce({})

      await userService.deleteUser('1')

      expect(axiosAuth.delete).toHaveBeenCalledWith('http://127.0.0.1:3000/users/1')
    })

    it("devrait gérer les erreurs lors de la suppression d'un utilisateur", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.delete as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(userService.deleteUser('1')).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })

    it("devrait mettre à jour le nom d'un utilisateur avec succès", async () => {
      ;(axiosAuth.patch as any).mockResolvedValueOnce({})

      await userService.changeName({ newName: 'Jane Doe', userId: '1' })

      expect(axiosAuth.patch).toHaveBeenCalledWith('http://127.0.0.1:3000/users/1', {
        name: 'Jane Doe'
      })
    })

    it("devrait gérer les erreurs lors de la mise à jour du nom d'un utilisateur", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.patch as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(userService.changeName({ newName: 'Jane Doe', userId: '1' })).rejects.toThrow(
        'Erreur Interprétée'
      )

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })

  describe('updatePasswordUser', () => {
    it("devrait mettre à jour le mot de passe d'un utilisateur avec succès", async () => {
      ;(axiosAuth.patch as any).mockResolvedValueOnce({})

      await userService.changePassword({ newPassword: 'newPassword', userId: '1' })

      expect(axiosAuth.patch).toHaveBeenCalledWith('http://127.0.0.1:3000/users/1', {
        password: 'newpassword'
      })
    })

    it("devrait gérer les erreurs lors de la mise à jour du mot de passe d'un utilisateur", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.patch as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(
        userService.changePassword({ newPassword: 'newPassword', userId: '1' })
      ).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })
})

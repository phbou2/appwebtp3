import { describe, it, expect, vi, beforeEach } from 'vitest'
import { questionService } from '../questionService'
import axiosAuth from '../../shared/axiosAuth'
import { parseAxiosError } from '../../shared/parseAxiosError'

// Mock axiosAuth e parseAxiosError
vi.mock('../../shared/axiosAuth', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

vi.mock('../../shared/parseAxiosError')

describe('questionService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('createCategory', () => {
    it('devrait créer une catégorie avec succès', async () => {
      ;(axiosAuth.post as any).mockResolvedValueOnce({})

      await questionService.createCategory('Nouvelle Catégorie')

      expect(axiosAuth.post).toHaveBeenCalledWith('http://127.0.0.1:3000/categories', {
        name: 'Nouvelle Catégorie'
      })
    })

    it("devrait gérer les erreurs lors de la création d'une catégorie", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.post as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(questionService.createCategory('Nouvelle Catégorie')).rejects.toThrow(
        'Erreur Interprétée'
      )

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })

  describe('createQuestion', () => {
    it('devrait créer une question avec succès', async () => {
      ;(axiosAuth.post as any).mockResolvedValueOnce({})

      await questionService.createQuestion("Qu'est-ce que Vue?", '1', '1', 'élevée')

      expect(axiosAuth.post).toHaveBeenCalledWith('http://127.0.0.1:3000/questions', {
        question: "Qu'est-ce que Vue?",
        userId: '1',
        categoryId: '1',
        priority: 'élevée'
      })
    })

    it("devrait gérer les erreurs lors de la création d'une question", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.post as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(
        questionService.createQuestion("Qu'est-ce que Vue?", '1', '1', 'élevée')
      ).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })

  describe('getAllQuestions', () => {
    it('devrait obtenir toutes les questions avec succès', async () => {
      const questions = [{ id: 1, question: "Qu'est-ce que Vue?" }]
      ;(axiosAuth.get as any).mockResolvedValueOnce({ data: questions })

      const result = await questionService.getAllQuestions()

      expect(result).toEqual(questions)
      expect(axiosAuth.get).toHaveBeenCalledWith('http://127.0.0.1:3000/questions')
    })

    it("devrait gérer les erreurs lors de l'obtention de toutes les questions", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.get as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(questionService.getAllQuestions()).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })

  describe('getAllCategories', () => {
    it('devrait obtenir toutes les catégories avec succès', async () => {
      const categories = [{ id: 1, name: 'Général' }]
      ;(axiosAuth.get as any).mockResolvedValueOnce({ data: categories })

      const result = await questionService.getAllCategories()

      expect(result).toEqual(categories)
      expect(axiosAuth.get).toHaveBeenCalledWith('http://127.0.0.1:3000/categories')
    })

    it("devrait gérer les erreurs lors de l'obtention de toutes les catégories", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.get as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(questionService.getAllCategories()).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })

  describe('getCategoryById', () => {
    it('devrait obtenir une catégorie par ID avec succès', async () => {
      const category = { id: 1, name: 'Général' }
      ;(axiosAuth.get as any).mockResolvedValueOnce({ data: category })

      const result = await questionService.getCategoryById('1')

      expect(result).toEqual(category)
      expect(axiosAuth.get).toHaveBeenCalledWith('http://127.0.0.1:3000/categories/1')
    })

    it("devrait gérer les erreurs lors de l'obtention d'une catégorie par ID", async () => {
      const error = new Error('Erreur Réseau')
      ;(axiosAuth.get as any).mockRejectedValueOnce(error)
      ;(parseAxiosError as any).mockReturnValueOnce('Erreur Interprétée')

      await expect(questionService.getCategoryById('1')).rejects.toThrow('Erreur Interprétée')

      expect(parseAxiosError).toHaveBeenCalledWith(error)
    })
  })
})

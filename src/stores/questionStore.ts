import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { questionService } from '../services/questionService'
import { useAuthStore } from './authStore'

export const useQuestionStore = defineStore('questionStoreId', () => {
  const onError = ref(false)
  const activeQuestionStatus = ref(false)
  const hasActiveQuestion = computed(() => activeQuestionStatus.value)

  async function getAllQuestions() {
    try {
      onError.value = false

      const questions: any[] = await questionService.getAllQuestions()

      return questions
    } catch (error) {
      onError.value = true
    }
  }

  async function getAllCategories() {
    try {
      onError.value = false
      const categories: any[] = await questionService.getAllCategories()
      return categories
    } catch (error) {
      onError.value = true
    }
  }

  async function createCategory(newCategory: string) {
    try {
      onError.value = false

      await questionService.createCategory(newCategory)
    } catch (error) {
      onError.value = true
    }
  }

  async function createQuestion(
    question: string,
    categoryId: string,
    userId: string,
    priority: string
  ) {
    try {
      onError.value = false

      await questionService.createQuestion(question, categoryId, userId, priority)
    } catch (error) {
      onError.value = true
    }
  }

  function toggleQuestionStatus() {
    activeQuestionStatus.value = !activeQuestionStatus.value
  }

  async function getCategoryById(categoryId: string) {
    try {
      onError.value = false

      const response = await questionService.getCategoryById(categoryId)

      return response
    } catch (error) {
      onError.value = true
    }
  }

  async function lowerHand(userId: string) {
    try {
      onError.value = false

      await questionService.lowerHand(userId)
    } catch (error) {
      onError.value = true
    }
  }

  async function deleteQuestion(questionId: string) {
    try {
      onError.value = false

      await questionService.deleteQuestion(questionId)
    } catch (error) {
      onError.value = true
    }
  }

  return {
    onError,
    hasActiveQuestion,
    toggleQuestionStatus,
    getAllQuestions,
    getAllCategories,
    createCategory,
    createQuestion,
    getCategoryById,
    lowerHand,
    deleteQuestion
  }
})

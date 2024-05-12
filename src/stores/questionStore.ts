import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { questionService } from '../services/questionService'
import { useAuthStore } from './authStore'

export const useQuestionStore = defineStore('questionStoreId', () => {
  const onError = ref(false)
  const handRaised = ref(false)
  const isHandRaised = computed(() => handRaised.value)

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

  function toggleHandRaised() {
    handRaised.value = !handRaised.value
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

  return {
    onError,
    isHandRaised,
    toggleHandRaised,
    getAllQuestions,
    getAllCategories,
    createCategory,
    createQuestion,
    getCategoryById
  }
})

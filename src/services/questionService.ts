import { parseAxiosError } from '../shared/parseAxiosError'
import axiosAuth from '../shared/axiosAuth'

const BACKEND_BASE_URL = 'http://127.0.0.1:3000'

async function createCategory(newCategory: string) {
  try {
    await axiosAuth.post(BACKEND_BASE_URL + '/categories', {
      name: newCategory
    })
  } catch (error) {
    throw parseAxiosError(error)
  }
}

async function createQuestion(
  question: string,
  categoryId: string,
  userId: string,
  priority: string
) {
  try {
    console.log(priority)
    await axiosAuth.post(BACKEND_BASE_URL + '/questions', {
      question: question,
      userId: userId,
      categoryId: categoryId,
      priority: priority
    })
  } catch (error) {
    throw parseAxiosError(error)
  }
}

async function getAllQuestions() {
  try {
    const response = await axiosAuth.get(BACKEND_BASE_URL + '/questions')

    return response.data
  } catch (error) {
    throw parseAxiosError(error)
  }
}
async function getAllCategories() {
  try {
    const response = await axiosAuth.get(BACKEND_BASE_URL + '/categories')

    return response.data
  } catch (error) {
    throw parseAxiosError(error)
  }
}

async function getCategoryById(categoryId: string) {
  try {
    const response = await axiosAuth.get(BACKEND_BASE_URL + '/categories/' + categoryId)

    return response.data
  } catch (error) {
    throw parseAxiosError(error)
  }
}

async function lowerHand(userId: string) {
  try {
    const response = await axiosAuth.get(BACKEND_BASE_URL + '/questions', {
      params: {
        userId: userId
      }
    })

    console.log(response.data)

    await axiosAuth.delete(BACKEND_BASE_URL + '/questions/' + response.data[0].id)
  } catch (error) {
    throw parseAxiosError(error)
  }
}

export const questionService = {
  createCategory,
  createQuestion,
  getAllQuestions,
  getAllCategories,
  getCategoryById,
  lowerHand
}

import { parseAxiosError } from '../shared/parseAxiosError'
import axiosAuth from '../shared/axiosAuth'

const BACKEND_BASE_URL = 'http://127.0.0.1:3000'

async function getUserById(userId: string) {
  try {
    // axiosAuth est une instance d'axios configurée pour ajouter le JWT à une requête nécessitant une authentification.
    // voir le fichier src/shared/axiosAuth.js
    const response = await axiosAuth.get(BACKEND_BASE_URL + '/users/' + userId)

    return response.data
  } catch (error) {
    throw parseAxiosError(error)
  }
}

async function getAllUsers() {
  try {
    const response = await axiosAuth.get(BACKEND_BASE_URL + '/users')

    return response.data
  } catch (error) {
    throw parseAxiosError(error)
  }
}

async function deleteUser(userId: string) {
  try {
    await axiosAuth.delete(BACKEND_BASE_URL + '/users/' + userId)
  } catch (error) {
    throw parseAxiosError(error)
  }
}

async function adjustScore(params: { amount: string; userId: string }) {
  try {
    const currentScore = (await axiosAuth.get(BACKEND_BASE_URL + '/users/' + params.userId)).data
      .Score

    const adjustedScore = currentScore + parseInt(params.amount)

    await axiosAuth.patch(BACKEND_BASE_URL + '/users/' + params.userId, { Score: adjustedScore })
  } catch (error) {
    throw parseAxiosError(error)
  }
}

export const userService = {
  getUserById,
  getAllUsers,
  deleteUser,
  adjustScore
}

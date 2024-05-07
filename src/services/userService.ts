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

async function getAllStudents() {
  try {
    const response = await axiosAuth.get(BACKEND_BASE_URL + '')
  } catch (error) {
    throw parseAxiosError(error)
  }
}

export const userService = {
  getUserById,
  getAllStudents
}

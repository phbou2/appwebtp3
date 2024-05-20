import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '../services/userService'
import { useAuthStore } from './authStore'

export const useProfileStore = defineStore('profileStoreId', () => {
  const email = ref('')
  const name = ref('')
  const role = ref('')
  const score = ref('')
  const isTeacher = computed(() => role.value === 'Teacher')
  const isStudent = computed(() => role.value === 'Student')
  const onError = ref(false)

  function _initializeProfile(profile: {
    email: string
    name: string
    role: string
    Score: string
  }) {
    email.value = profile.email
    name.value = profile.name
    role.value = profile.role
    score.value = profile.Score
    onError.value = false
  }

  async function getProfile() {
    try {
      onError.value = false
      const authStore = useAuthStore()
      const userId = authStore.getUserId // Assuming getUserId is a computed or a ref inside authStore
      const profile = await userService.getUserById(userId)
      _initializeProfile(profile)
    } catch (error) {
      onError.value = true
    }
  }

  async function getAllStudents() {
    try {
      onError.value = false

      const users: any[] = await userService.getAllUsers()

      const students: any[] = users.filter((user) => user.role === 'Student')

      return students
    } catch (error) {
      onError.value = true
    }
  }

  async function getAllTeachers() {
    try {
      onError.value = false

      const users: any[] = await userService.getAllUsers()

      const teachers: any[] = users.filter((user) => user.role === 'Teacher')

      return teachers
    } catch (error) {
      onError.value = true
    }
  }

  async function deleteUser(userId: string) {
    try {
      onError.value = false

      await userService.deleteUser(userId)
    } catch (error) {
      onError.value = true
    }
  }

  async function getUserById(userId: string) {
    try {
      onError.value = false

      const response = await userService.getUserById(userId)
      return response
    } catch (error) {
      onError.value = true
    }
  }

  async function adjustScore(params: { amount: string; userId: string }) {
    try {
      onError.value = false

      await userService.adjustScore(params)
    } catch (error) {
      onError.value = true
    }
  }

  async function changePassword(params: { newPassword: string; userId: string }) {
    try {
      onError.value = false

      await userService.changePassword(params)
    } catch (error) {
      onError.value = true
    }
  }

  async function changeName(params: { newName: string; userId: string }) {
    try {
      onError.value = false

      await userService.changeName(params)
    } catch (error) {
      onError.value = true
    }
  }

  return {
    email,
    name,
    role,
    score,
    onError,
    getProfile,
    isTeacher,
    getAllStudents,
    getAllTeachers,
    deleteUser,
    isStudent,
    getUserById,
    adjustScore,
    changePassword,
    changeName
  }
})

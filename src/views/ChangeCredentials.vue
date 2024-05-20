<script setup lang="ts">
import { ref, computed } from 'vue'
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useProfileStore } from '@/stores/profileStore'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import 'vue-toast-notification/dist/theme-sugar.css'

defineRule('isRequired', required)

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const toast = useToast()
const isLoading = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const newName = ref('')
const confirmName = ref('')
const isTeacher = computed(() => profileStore.isTeacher)

const authServiceError = computed(() => authStore.authServiceError)

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }

  isLoading.value = true
  const userId = await authStore.getUserId
  const user = await profileStore.getUserById(userId)
  if (user.password === 1) {
    //Normallement j'aurais user.password === currentPassword mais je n'ai pas compris comment l'encryption du mot de passe fonctionnait donc je n'ai pas pu le faire
    toast.error('Mot de passe courant incorrect', { duration: 5000 })
  } else {
    const params = { newPassword: newPassword.value, userId: userId }
    await profileStore.changePassword(params)
    if (!authStore.authServiceError) {
      toast.success('Mot de passe changé avec succès', { duration: 5000 })
      router.push({ name: 'Profile' })
    }
  }
  isLoading.value = false
}

const changeName = async () => {
  if (newName.value !== confirmName.value) {
    toast.error('Les noms ne correspondent pas')
    return
  }

  isLoading.value = true
  const userId = await authStore.getUserId
  const params = { newName: newName.value, userId: userId }
  await profileStore.changeName(params)
  isLoading.value = false

  if (!authStore.authServiceError) {
    toast.success('Nom changé avec succès', { duration: 5000 })
    router.push({ name: 'Profile' })
  }
}
const isRequired = (value: any) => (!value ? 'Ce champ est requis.' : true)
</script>

<template>
  <div>
    <h1 class="title">Changer mot de passe</h1>
    <div class="container my-5">
      <div class="row justify-content-center">
        <Form @submit="changePassword">
          <div class="mb-3">
            <label class="form-label" for="current-password-input">Mot de passe actuel</label>
            <Field
              class="form-control"
              id="current-password-input"
              name="current-password-input"
              type="password"
              :rules="isRequired"
              v-model="currentPassword"
            />
            <ErrorMessage class="text-danger" name="current-password-input" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="new-password-input">Nouveau mot de passe</label>
            <Field
              class="form-control"
              id="new-password-input"
              name="new-password-input"
              type="password"
              :rules="isRequired"
              v-model="newPassword"
            />
            <ErrorMessage class="text-danger" name="new-password-input" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="confirm-password-input"
              >Confirmer le nouveau mot de passe</label
            >
            <Field
              class="form-control"
              id="confirm-password-input"
              name="confirm-password-input"
              type="password"
              :rules="isRequired"
              v-model="confirmPassword"
            />
            <ErrorMessage class="text-danger" name="confirm-password-input" />
          </div>
          <div class="p-3 mb-2 bg-danger text-white" v-if="authServiceError">
            {{ authServiceError }}
          </div>
          <button class="btn btn-primary" type="submit">Changer le mot de passe</button>
        </Form>
      </div>
    </div>

    <h1 v-if="isTeacher" class="title">Changer le nom</h1>
    <div v-if="isTeacher" class="container my-5">
      <div class="row justify-content-center">
        <Form @submit="changeName">
          <div class="mb-3">
            <label class="form-label" for="new-name-input">Nouveau nom</label>
            <Field
              class="form-control"
              id="new-name-input"
              name="new-name-input"
              :rules="isRequired"
              v-model="newName"
            />
            <ErrorMessage class="text-danger" name="new-name-input" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="confirm-name-input">Confirmer le nouveau nom</label>
            <Field
              class="form-control"
              id="confirm-name-input"
              name="confirm-name-input"
              :rules="isRequired"
              v-model="confirmName"
            />
            <ErrorMessage class="text-danger" name="confirm-name-input" />
          </div>
          <div class="p-3 mb-2 bg-danger text-white" v-if="authServiceError">
            {{ authServiceError }}
          </div>
          <button class="btn btn-primary" type="submit">Changer le nom</button>
        </Form>
      </div>
    </div>

    <Loading :active="isLoading" />
  </div>
</template>

<style scoped>
.title {
  padding-left: 20px;
}
</style>

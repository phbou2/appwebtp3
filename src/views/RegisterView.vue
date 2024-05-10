<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import 'vue-toast-notification/dist/theme-sugar.css'

defineRule('isRequired', required)

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const isLoading = ref(false)

const email = ref('')
const password = ref('')
const name = ref('')

const authServiceError = computed(() => authStore.authServiceError)

onMounted(() => {
  authStore.clearError()
})

const register = async () => {
  isLoading.value = true

  await authStore.register({
    email: email.value,
    password: password.value,
    name: name.value
  })

  isLoading.value = false

  if (!authStore.authServiceError) {
    toast.success('Étudiant créé avec succès', { duration: 5000 })
    router.push({ name: 'Profile' })
  }
}

// Fonction pour vérifier si un champ est vide, utilisée dans les règles de vee-validate
const isRequired = (value: any) => (!value ? 'Ce champ est requis.' : true)

const isValidEmail = (value: any) => {
  if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
    return 'Adresse email invalide'
  }
  return true
}
</script>

<template>
  <div>
    <h1 class="title">Créer un étudiant</h1>
    <div class="container my-5">
      <div class="row justify-content-center">
        <Form @submit="register">
          <div class="mb-3">
            <label class="form-label" for="name-input">Nom</label>
            <Field
              class="form-control"
              id="name-input"
              name="name-input"
              :rules="isRequired"
              v-model="name"
            />
            <ErrorMessage class="text-danger" name="name-input" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="email-input">Courriel</label>
            <Field
              class="form-control"
              id="email-input"
              name="email-input"
              type="email"
              :rules="[isRequired, isValidEmail]"
              v-model="email"
            />
            <ErrorMessage class="text-danger" name="email-input" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="password-input">Mot de passe</label>
            <Field
              class="form-control"
              id="password-input"
              name="password-input"
              type="password"
              :rules="isRequired"
              v-model="password"
            />
            <ErrorMessage class="text-danger" name="password-input" />
          </div>
          <div class="p-3 mb-2 bg-danger text-white" v-if="authServiceError">
            {{ authServiceError }}
          </div>
          <button class="btn btn-primary" type="submit">Créer un étudiant</button>
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

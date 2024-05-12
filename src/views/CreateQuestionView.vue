<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { useQuestionStore } from '../stores/questionStore'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import 'vue-toast-notification/dist/theme-sugar.css'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

defineRule('isRequired', required)
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const questionStore = useQuestionStore()
const onError = computed(() => questionStore.onError)
const isLoading = ref(false)

const question = ref('')
const categoryId = ref('')
const priority = ref('')

const categories = ref<any[] | undefined>(undefined)
const priorities = ['Informative', 'Faible', 'Moyenne', 'Importante', 'Urgente']

onMounted(async () => {
  isLoading.value = true
  try {
    categories.value = await questionStore.getAllCategories()
    if (onError.value) {
      confirm("Une erreur s'est produite lors de la récupération des catégories de questions.")
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }
  isLoading.value = false
})

async function createNewQuestion() {
  isLoading.value = true
  try {
    const userId = await authStore.getUserId

    console.log(priority.value)

    await questionStore.createQuestion(question.value, categoryId.value, userId, priority.value)

    toast.success('Question posée avec succès', { duration: 5000 })

    router.push({ name: 'Profile' })
    if (onError.value) {
      confirm("Une erreur s'est produite lors de la supprimation de l'utilisateur.")
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }

  isLoading.value = false
}

const isRequired = (value: any) => (!value ? 'Ce champ est requis.' : true)
</script>

<template>
  <div>
    <h1>Poser une question</h1>
    <div class="container my-5">
      <div class="row justify-content-center">
        <Form @submit="createNewQuestion">
          <div class="mb-3">
            <label class="form-label" for="question-input">Description de la question</label>
            <!-- Set the question input to take 50% of the screen -->
            <Field
              class="form-control half-width"
              id="question-input"
              name="question-input"
              type="question"
              :rules="isRequired"
              v-model="question"
            />
            <ErrorMessage class="text-danger" name="question-input" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="category-select">Catégorie</label>
            <Field
              as="select"
              class="form-select half-width"
              id="category-select"
              name="category-select"
              v-model="categoryId"
              :rules="isRequired"
            >
              <option v-for="category in categories" :value="category.id" :key="category.id">
                {{ category.name }}
              </option>
            </Field>
            <ErrorMessage class="text-danger" name="category-select" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="priority-select">Priorité</label>
            <Field
              as="select"
              class="form-select half-width"
              id="priority-select"
              name="priority-select"
              v-model="priority"
              :rules="isRequired"
            >
              <option
                v-for="(priority, index) in priorities"
                :value="priority"
                :key="index"
                :selected="index === 0"
              >
                {{ priority }}
              </option>
            </Field>
            <ErrorMessage class="text-danger" name="priority-select" />
          </div>
          <button type="submit" class="btn btn-primary">Poser votre question</button>
        </Form>
      </div>
    </div>
    <Loading :active="isLoading" />
  </div>
</template>

<style scoped>
.half-width {
  width: 50%;
}
</style>

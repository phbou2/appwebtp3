<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '@/stores/questionStore'

const authStore = useAuthStore()
const router = useRouter()
const profileStore = useProfileStore()
const questionStore = useQuestionStore()

const name = computed(() => profileStore.name)
const email = computed(() => profileStore.email)
const onError = computed(() => profileStore.onError)
const isLoggedIn = computed(() => authStore.isLoggedIn)
const isTeacher = computed(() => profileStore.isTeacher)
const isStudent = computed(() => profileStore.isStudent)
const hasActiveQuestion = computed(() => questionStore.hasActiveQuestion)
const isLoading = ref(false)
const questions = ref<any[] | undefined>(undefined)
const updatedQuestions = ref<any[] | undefined>(undefined) //For front-end accessibility

onMounted(async () => {
  isLoading.value = true
  try {
    await profileStore.getProfile()
    await loadQuestions()
    if (onError.value) {
      // Utilisation d'une boîte de dialogue au lieu de 'confirm'
      confirm("Une erreur s'est produite lors de la récupération du profil de l'utilisateur.")
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }
  isLoading.value = false
})

async function loadQuestions() {
  questions.value = await questionStore.getAllQuestions()
  await updateUserAndCategoryNames()
}

async function lowerHand() {
  isLoading.value = true
  questionStore.toggleQuestionStatus()
  const userId = await authStore.getUserId
  await questionStore.lowerHand(userId)
  await loadQuestions()
  isLoading.value = false
}

async function updateUserAndCategoryNames() {
  if (!questions.value) {
    return []
  }

  updatedQuestions.value = []

  for (let i = 0; i < questions.value.length; i++) {
    const question = questions.value[i]

    const user = await profileStore.getUserById(question.userId)
    const userName = user.name

    const category = await questionStore.getCategoryById(question.categoryId)
    const categoryName = category.name

    const updatedQuestion = {
      question: question.question,
      userName: userName,
      categoryName: categoryName,
      priority: question.priority
    }

    updatedQuestions.value.push(updatedQuestion)
  }
}
</script>

<template>
  <div>
    <h1>Profile</h1>
    <div>Nom: {{ isLoading ? 'Loading...' : name }}</div>
    <div>Courriel: {{ isLoading ? 'Loading...' : email }}</div>
  </div>
  <div class="container">
    <div class="row">
      <div class="container col-8">
        <div v-for="question in updatedQuestions" :key="question.id" class="py-3">
          <div class="">
            <div class="container card">
              <div class="card-title row bg-warning">
                <p class="col-2">{{ question.priority }}</p>
                <p class="col-7">{{ question.question }}</p>
                <p class="col-1">{{ question.categoryName }}</p>
                <button
                  class="btn btn-danger col-2"
                  @click="deleteQuestion(question.id)"
                  v-if="isTeacher"
                >
                  x
                </button>
              </div>
              <div class="card-body row bg-secondary">
                <p class="col-3">{{ question.userName }}</p>
                <div class="progress col-6">
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    role="progressbar"
                    :style="{ width: 100 + '%' }"
                    aria-valuenow="50"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-4 row">
        <div class="">
          <h3 class="py-3 d-flex">{{ name }}</h3>
        </div>
        <div class="progress">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated bg-success"
            role="progressbar"
            :style="{ width: 100 + '%' }"
            aria-valuenow="50"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            100%
          </div>
        </div>
        <div class="col-6"></div>

        <div>
          <div>
            <div class="py-2" v-if="isTeacher">
              <button v-if="isLoggedIn" class="btn btn-primary col-6">
                <RouterLink
                  class="nav-link"
                  :class="{ active: $route.name == 'Register' }"
                  :to="{ name: 'Register' }"
                >
                  Créer un étudiant
                </RouterLink>
              </button>
            </div>

            <div class="py-2" v-if="isTeacher">
              <button v-if="isLoggedIn" class="btn btn-primary col-6">
                <RouterLink
                  class="nav-link"
                  :class="{ active: $route.name == 'Delete' }"
                  :to="{ name: 'Delete' }"
                >
                  Supprimer un étudiant
                </RouterLink>
              </button>
            </div>

            <div class="py-2" v-if="isTeacher">
              <button v-if="isLoggedIn" class="btn btn-primary col-6">
                <RouterLink
                  class="nav-link"
                  :class="{ active: $route.name == 'CreateCategory' }"
                  :to="{ name: 'CreateCategory' }"
                >
                  Créer une nouvelle catégorie
                </RouterLink>
              </button>
            </div>
            <div class="py-2" v-if="isStudent">
              <button v-if="isLoggedIn" class="btn btn-primary col-6">
                <RouterLink
                  class="nav-link"
                  :class="{ active: $route.name == 'CreateQuestion' }"
                  :to="{ name: 'CreateQuestion' }"
                >
                  Poser une question
                </RouterLink>
              </button>
            </div>
            <div class="py-2" v-if="isStudent">
              <button
                v-if="isLoggedIn && hasActiveQuestion"
                class="btn btn-primary col-6"
                @click="lowerHand"
              >
                Baisser la main
              </button>
            </div>
            <div class="py-2" v-if="isStudent">
              <button v-if="isLoggedIn" class="btn btn-primary col-6">
                <RouterLink
                  class="nav-link"
                  :class="{ active: $route.name == 'AdjustTeacherScore' }"
                  :to="{ name: 'AdjustTeacherScore' }"
                >
                  Ajuster le score d'un professeur
                </RouterLink>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading :active="isLoading" />
  </div>
</template>

<style scoped></style>

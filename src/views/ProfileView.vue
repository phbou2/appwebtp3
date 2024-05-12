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
const isHandRaised = computed(() => questionStore.isHandRaised)
const isLoading = ref(false)
const questions = ref<any[] | undefined>(undefined)
const updatedQuestions = ref<any[] | undefined>(undefined) //For front-end accessibility

onMounted(async () => {
  isLoading.value = true
  try {
    await profileStore.getProfile()
    questions.value = await questionStore.getAllQuestions()
    await updateUserAndCategoryNames()
    if (onError.value) {
      // Utilisation d'une boîte de dialogue au lieu de 'confirm'
      confirm("Une erreur s'est produite lors de la récupération du profil de l'utilisateur.")
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }
  isLoading.value = false
})

function toggleHandRaised() {
  questionStore.toggleHandRaised()
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
  <div>
    <div v-for="question in updatedQuestions" :key="question.id">
      <h3>{{ question.question }}</h3>
      <p>Nom : {{ question.userName }}</p>
      <p>Category ID: {{ question.categoryName }}</p>
      <p>Priority: {{ question.priority }}</p>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-8 bg-danger">
        <div></div>
      </div>
      <div class="col-4 bg-warning row">
        <div class="">
          <div class="col-6 progress">
            <div class="progress">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                role="progressbar"
                :style="{ width: 100 }"
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                100%
              </div>
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
                <button v-if="isLoggedIn" class="btn btn-primary col-6" @click="toggleHandRaised">
                  {{ isHandRaised ? 'Baisser la main' : 'Lever la main' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading :active="isLoading" />
  </div>
</template>

<style scoped></style>

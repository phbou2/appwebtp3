<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const profileStore = useProfileStore()

const name = computed(() => profileStore.name)
const email = computed(() => profileStore.email)
const onError = computed(() => profileStore.onError)
const isLoggedIn = computed(() => authStore.isLoggedIn)
const isTeacher = computed(() => profileStore.isTeacher)
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    await profileStore.getProfile()
    if (onError.value) {
      // Utilisation d'une boîte de dialogue au lieu de 'confirm'
      confirm("Une erreur s'est produite lors de la récupération du profil de l'utilisateur.")
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }
  isLoading.value = false
})
</script>

<template>
  <div>
    <h1>Profile</h1>
    <div>Nom: {{ isLoading ? 'Loading...' : name }}</div>
    <div>Courriel: {{ isLoading ? 'Loading...' : email }}</div>
    <Loading :active="isLoading" />
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
                <button class="btn btn-primary col-6">
                  <RouterLink
                    class="nav-link"
                    :class="{ active: $route.name == 'Register' }"
                    v-if="isLoggedIn"
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
                    v-if="isLoggedIn"
                    :to="{ name: 'Delete' }"
                  >
                    Supprimer un étudiant
                  </RouterLink>
                </button>
              </div>

              <div class="py-2">
                <button class="btn btn-primary col-6">create new category</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

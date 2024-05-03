<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const profileStore = useProfileStore()

const name = computed(() => profileStore.name)
const email = computed(() => profileStore.email)
const onError = computed(() => profileStore.onError)
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
    <div>Nom: {{ name }}</div>
    <div>Courriel: {{ email }}</div>
    <Loading :active="isLoading" />
  </div>
</template>

<style scoped></style>

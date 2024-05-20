<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { useToast } from 'vue-toast-notification'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const profileStore = useProfileStore()
const isLoading = ref(false)
const toast = useToast()
const onError = computed(() => profileStore.onError)

const ADD_SCORE_AMOUNT = '10'
const REMOVE_SCORE_AMOUNT = '-10'

const teachers = ref<any[] | undefined>(undefined)

onMounted(async () => {
  isLoading.value = true
  try {
    teachers.value = await profileStore.getAllTeachers()

    if (onError.value) {
      // Utilisation d'une boîte de dialogue au lieu de 'confirm'
      confirm("Une erreur s'est produite lors de la récupération du profil de l'utilisateur.")
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }
  isLoading.value = false
})

async function adjustScore(params: { amount: string; userId: string }) {
  isLoading.value = true
  try {
    if (teachers.value !== undefined) {
      await profileStore.adjustScore(params)

      const updatedTeacher = await profileStore.getUserById(params.userId)
      const index = teachers.value.findIndex((teacher) => teacher.id === params.userId)
      if (index !== -1) {
        teachers.value[index].Score = updatedTeacher.Score
      }

      if (onError.value) {
        confirm("Une erreur s'est produite lors de la modification du score de l'utilisateur.")
      }
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }
  isLoading.value = false
}
</script>

<template>
  <div>
    <h1 class="title">Ajuster le score d'un professeur</h1>
    <div class="subtitle" v-if="!teachers || teachers.length === 0">
      <h4>Il n'y a actuellement aucun professeur enregistré dans la base de données.</h4>
    </div>
    <table v-else-if="teachers && teachers.length" class="students-table">
      <thead>
        <tr>
          <th class="label-cell">Nom du professeur</th>
          <th class="label-cell">Score</th>
          <th class="label-cell"></th>
          <th class="label-cell"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="teacher in teachers!" :key="teacher.id" class="student-row">
          <td class="data-cell">{{ teacher.name }}</td>
          <td class="data-cell">{{ teacher.Score }}</td>
          <td class="data-cell">
            <button
              class="add-button"
              @click="adjustScore({ amount: ADD_SCORE_AMOUNT, userId: teacher.id })"
            >
              Ajouter du score
            </button>
          </td>
          <td class="data-cell">
            <button
              class="remove-button"
              @click="adjustScore({ amount: REMOVE_SCORE_AMOUNT, userId: teacher.id })"
            >
              Enlever du score
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <Loading :active="isLoading" />
  </div>
</template>

<style scoped>
.title,
.subtitle,
.label-cell,
.data-cell {
  padding-left: 10px;
}

.data-cell {
  padding-bottom: 10px;
}

.label-cell {
  width: 100px;
}

.students-table {
  table-layout: fixed;
  width: 100%;
}

.remove-button {
  background-color: red;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 5px 30px;
  cursor: pointer;
}

.add-button {
  background-color: cyan;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 5px 30px;
  cursor: pointer;
}
</style>

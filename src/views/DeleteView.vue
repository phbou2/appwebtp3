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

const students = ref<any[] | undefined>(undefined)

onMounted(async () => {
  isLoading.value = true
  try {
    students.value = await profileStore.getAllStudents()

    if (onError.value) {
      // Utilisation d'une boîte de dialogue au lieu de 'confirm'
      confirm("Une erreur s'est produite lors de la récupération du profil de l'utilisateur.")
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }
  isLoading.value = false
})

async function deleteStudent(studentId: string) {
  isLoading.value = true
  try {
    await profileStore.deleteUser(studentId)

    toast.success('Étudiant supprimé avec succès', { duration: 5000 })

    students.value = await profileStore.getAllStudents()
    if (onError.value) {
      confirm("Une erreur s'est produite lors de la supprimation de l'utilisateur.")
    }
  } catch (error) {
    confirm("Erreur critique lors de l'accès au store.")
  }

  isLoading.value = false
}
</script>

<template>
  <div>
    <h1 class="title">Supprimer un étudiant</h1>
    <div class="subtitle" v-if="!students || students.length === 0">
      <h4>
        Il n'y a actuellement aucun étudiant enregistré dans la base de données. Vous pouvez
        enregistrer de nouveaux étudiants dans la page "Profile".
      </h4>
    </div>
    <table v-else-if="students && students.length" class="students-table">
      <thead>
        <tr>
          <th class="label-cell">ID</th>
          <th class="label-cell">Name</th>
          <th class="label-cell">Email</th>
          <th class="label-cell"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students!" :key="student.id" class="student-row">
          <td class="data-cell">{{ student.id }}</td>
          <td class="data-cell">{{ student.name }}</td>
          <td class="data-cell">{{ student.email }}</td>
          <td class="data-cell">
            <button class="delete-button" @click="deleteStudent(student.id)">Supprimer</button>
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

.delete-button {
  background-color: red;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 5px 30px;
  cursor: pointer;
}
</style>

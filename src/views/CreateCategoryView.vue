<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { useQuestionStore } from '../stores/questionStore'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import 'vue-toast-notification/dist/theme-sugar.css'

defineRule('isRequired', required)
const router = useRouter()
const toast = useToast()
const questionStore = useQuestionStore()

const newCategoryName = ref('')

async function createNewCategory() {
  questionStore.createCategory(newCategoryName.value)
  toast.success('Catégorie créé avec succès', { duration: 5000 })
  router.push({ name: 'Profile' })
}

const isRequired = (value: any) => (!value ? 'Ce champ est requis.' : true)
</script>

<template>
  <div>
    <h1>Connexion</h1>
    <div class="container my-5">
      <div class="row justify-content-center">
        <Form @submit="createNewCategory">
          <div class="mb-3">
            <label class="form-label" for="newCategoryName-input">Nom de la catégorie</label>
            <Field
              class="form-control"
              id="newCategoryName-input"
              name="newCategoryName-input"
              type="newCategoryName"
              :rules="isRequired"
              v-model="newCategoryName"
            />
            <ErrorMessage class="text-danger" name="newCategoryName-input" />
          </div>
          <!-- Add a submit button -->
          <button type="submit" class="btn btn-primary">Créer</button>
        </Form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

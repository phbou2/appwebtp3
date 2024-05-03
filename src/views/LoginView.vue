<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Field, Form, ErrorMessage, defineRule, validate } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

// Définir les règles de validation
defineRule('isRequired', required);

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');

const authServiceError = computed(() => authStore.authServiceError);

onMounted(() => {
  authStore.clearError();
});

const login = async () => {
  // Validation manuelle avant la soumission
  const result = await validate({
    email: email.value,
    password: password.value
  });
  if (!result.valid) {
    return; // Arrête la fonction si la validation échoue
  }

  await authStore.login({
    email: email.value,
    password: password.value
  });
  
  if (!authStore.authServiceError) {
    router.push({ name: 'Profile' });
  }
};

// Fonction pour vérifier si un champ est vide, utilisée dans les règles de vee-validate
const isRequired = (value: string) => !value ? 'Ce champ est requis.' : true;
</script>

<template>

  <div>
    <h1>Connexion</h1>
    <ul>
      <div class="container d-flex justify-content-center">

        <div class="card col bg-secondary">
          <div class="card-header bg-danger d-flex justify-content-center">
            <h3>Login</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <Form @submit="login">

                <div class="col py-2">
                  <label for="email-input">Email</label>
                  <div class="form-group">
                    <Field
                      class="form-control"
                      id="email-input"
                      name="email-input"
                      type="email"
                      :rules="isRequired"
                      v-model="email"
                      />
                      <ErrorMessage class="text-warning" name="email-input" />
                  </div>
                </div>

                <div class="col py-2">
                  <label for="password-input">Password</label>
                  <div class="form-group">  
                    <Field
                      class="form-control"
                      id="password-input"
                      name="password-input"
                      type="password"
                      :rules="isRequired"
                      v-model="password"
                    />
                    <ErrorMessage class="text-warning" name="password-input" />
                  </div>
                </div>
                <div class="p-3 mb-2 bg-danger text-white" v-if="authServiceError">
                  {{ authServiceError }}
                </div>
                <button class="btn btn-primary" type="submit">Se connecter</button>
              </Form>
            </div>
          
          </div>

        </div>

      </div>
    </ul>

  </div>


</template>

<style scoped></style>
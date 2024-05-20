import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import NavigationBar from '../NavigationBar.vue'
import { useAuthStore } from '../../stores/authStore'

//partie faite à l'aide de chatgpt
const routes = [
  { path: '/Home', name: 'Home', component: { template: '<div>Home</div>' } },
  { path: '/login', name: 'Login', component: { template: '<div>Login</div>' } },
  { path: '/register', name: 'Register', component: { template: '<div>Register</div>' } },
  { path: '/about', name: 'About', component: { template: '<div>About</div>' } },
  { path: '/profile', name: 'Profile', component: { template: '<div>Profile</div>' } },
  { path: '/change-name', name: 'ChangeName', component: { template: '<div>ChangeName</div>' } },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: { template: '<div>ChangePassword</div>' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

describe('NavigationBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    router.push('/login')
  })

  describe('utilisateur non connecté', () => {
    it("devrait afficher l'option de connexion", async () => {
      const wrapper = mount(NavigationBar, {
        global: {
          plugins: [router]
        }
      })

      const authStore = useAuthStore()
      authStore.token = ''

      await router.isReady()

      expect(wrapper.find('.login').exists()).toBe(true)
    })
  })

  describe('utilisateur connecté', () => {
    it("devrait afficher l'option de déconnexion", async () => {
      const wrapper = mount(NavigationBar, {
        global: {
          plugins: [router]
        }
      })

      const authStore = useAuthStore()
      authStore.token = '$2a$10$/U4TD6TdllwpkXLdBzoagepGDpOGcRFTS6VHAnYGNeCKsuhpEWmX2'

      await router.isReady()

      expect(wrapper.find('.logout').exists()).toBe(true)
    })
  })
})

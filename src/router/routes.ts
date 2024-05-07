import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import NotFound from '../views/NotFoundView.vue'
import RegisterView from '../views/RegisterView.vue'
import DeleteView from '../views/DeleteView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/delete',
    name: 'Delete',
    component: DeleteView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default routes

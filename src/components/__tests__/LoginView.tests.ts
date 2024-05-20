import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import LoginView from '../../views/LoginView.vue'

vi.mock('../../views/LoginView.vue', () => ({
  __esModule: true,
  default: {
    login: vi.fn()
  }
}))

describe('LoginForm.vue', () => {
  it("devrait afficher des messages d'erreur requis lorsque aucun champ n'est rempli", async () => {
    const wrapper = mount(LoginView)
    console.log('HTML:', wrapper.html())

    await wrapper.find('button').trigger('click')
    console.log('HTML:', wrapper.html())

    const emailError = wrapper.find('.email-error')
    const passwordError = wrapper.find('.password-error')

    expect(emailError.exists()).toBe(true)
    expect(emailError.text()).toBe('Ce champ est requis.')
    expect(passwordError.exists()).toBe(true)
    expect(passwordError.text()).toBe('Ce champ est requis.')
  })

  it("devrait afficher une erreur d'email invalide lorsqu'un email invalide est entré", async () => {
    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('#email-input')
    await emailInput.setValue('invalid-email')

    await wrapper.find('#sendBtn').trigger('click')

    await wrapper.vm.$nextTick()

    const emailError = wrapper.find('#email-error')
    expect(emailError.exists()).toBe(true)
    expect(emailError.text()).toBe('Adresse email invalide')
  })

  it("ne devrait pas afficher d'erreur d'email lorsqu'un email valide est entré", async () => {
    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('#email-input')
    await emailInput.setValue('test@test.com')

    await wrapper.find('#sendBtn').trigger('click')

    await wrapper.vm.$nextTick()

    const emailError = wrapper.find('#email-error')
    expect(emailError.exists()).toBe(false)
  })

  it("devrait émettre un événement de connexion lorsque des informations d'identification valides sont entrées", async () => {
    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('#email-input')
    await emailInput.setValue('test@test.com')

    const passwordInput = wrapper.find('#password-input')
    await passwordInput.setValue('test')

    await wrapper.find('#sendBtn').trigger('click')

    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('login')
    expect(emitted).toBeTruthy()
    if (emitted) {
      expect(emitted[0]).toEqual(['test@test.com', 'test'])
    }
  })
})

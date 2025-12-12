import { defineStore } from 'pinia'

export const useResetPasswordStore = defineStore('resetPassword', {
  state: () => ({
    email: '',
    step: '',
  }),

  getters: {
    isVerifying: (state) => state.step === 'verify',
  },

  actions: {
    setEmail(email) {
      this.email = email
      this.step = 'verify'
    },
    clear() {
      this.email = ''
      this.step = ''
    },
  },
})

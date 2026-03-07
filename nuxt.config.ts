import { isPlatform } from '@ionic/core'
import { iosTransitionAnimation, popoverEnterAnimation, popoverLeaveAnimation } from '@rdlabo/ionic-theme-ios26'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  modules: ['@peterbud/nuxt-query', '@nuxtjs/ionic'],
  vite: {
    plugins: [<any>tailwindcss()],
  },
  ionic: {
    config: {
      mode: 'ios',
      navAnimation: iosTransitionAnimation,
      popoverEnter: popoverEnterAnimation,
      popoverLeave: popoverLeaveAnimation,
    },
  },
})

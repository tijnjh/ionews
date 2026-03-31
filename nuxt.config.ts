import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  modules: ['@peterbud/nuxt-query', '@nuxtjs/ionic'],
  vite: {
    plugins: [<any>tailwindcss()],

    server: {
      allowedHosts: ['5f21-31-149-152-185.ngrok-free.app'],
    },
  },
  ionic: {
    config: { mode: 'ios' },
  },
})

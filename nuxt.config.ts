import { defineNuxtConfig } from 'nuxt/config';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@nuxt/image-edge',
  ],
  css: [
    '~/assets/css/_variables.css',
    '~/assets/css/layout.css',
    '~/assets/css/spacing.css',
    '~/assets/css/typography.css',
    '~/assets/css/ui.css',
    '~/assets/css/utilities.css',
    '~/assets/css/main.css',
  ],
  app: {
    head: {
      title: 'Shelf',
      link: [
        { rel: 'icon', href: 'favicon.svg' },
        { rel: 'preconnect', href: 'https://whzpxqepohgfixqojtca.supabase.co'},
        { rel: 'preconnect', href: 'https://imagedelivery.net'},
      ],
      meta: [
        { name: "description", content: "Shelf is a book tracking app that provides a more joyful online user experience. Shelf not only provides insight and data into users reading habits, but it also turns the private experience of reading into a community-based activity that is beautiful, delightful, and shareable." }
      ],
    },
  },
  image: {
    baseURL: 'https://imagedelivery.net',
  }
})

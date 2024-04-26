<script setup>
import { useHead } from '@unhead/vue'

useHead({
  title: 'Montréal: Comprendre les accidents de la route',
  meta: [
    {
      name: 'description',
      content: 'Les collisions de véhicules motorisés à Montréal sont un défi majeur. Nos analyses de 2011 à 2022 visent à renforcer la sécurité routière en identifiant les facteurs de risque et en sensibilisant les conducteurs pour des routes plus sûres.',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon2.svg',
    },
  ],
})
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-200">
    <RouterView />
  </main>
</template>

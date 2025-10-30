// Nuxt 3 PWA Offline Notes
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt'],
  typescript: { typeCheck: true },

  app: {
    head: {
      title: 'Notas Rápidas',
      meta: [
        { name: 'viewport', content: 'width=device-width,initial-scale=1,viewport-fit=cover' },
        { name: 'theme-color', content: '#0ea5e9' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg'],
    manifest: {
      name: 'Notas Rápidas',
      short_name: 'Notas',
      description: 'PWA de notas que funciona offline.',
      theme_color: '#0ea5e9',
      background_color: '#f8fafc',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/pwa-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/offline\.html$/],
      cleanupOutdatedCaches: true,
      navigationPreload: true,
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: ({request}) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: { cacheName: 'html-cache' }
        },
        {
          urlPattern: ({request}) => request.destination === 'script' || request.destination === 'style',
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'asset-cache' }
        },
        {
          urlPattern: ({request}) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 }
          }
        }
      ]
    },
    devOptions: {
      enabled: false
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 24 * 60 * 60
    }
  },

  compatibilityDate: '2025-10-28'
})
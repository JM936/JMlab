module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,json,png,svg,jpg,gif,ico,webp,woff,woff2,eot,ttf}'
  ],
  swDest: 'build/service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-cache'
      }
    }
  ]
};
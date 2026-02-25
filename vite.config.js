// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5174,
//     proxy: {
//       '/register': 'http://localhost:8080',
//       '/login': 'http://localhost:8080',
//       '/logout': 'http://localhost:8080',
//       '/check-session': 'http://localhost:8080',
//       '/expense': 'http://localhost:8080',
//       '/expenses': 'http://localhost:8080',
//       '/income': 'http://localhost:8080',
//       '/summary': 'http://localhost:8080'
//     }
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ IMPORTANT: add your repository name here
  base: '/-springtrackervercel/',

  server: {
    port: 5174,
    proxy: {
      '/register': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/check-session': 'http://localhost:8080',
      '/expense': 'http://localhost:8080',
      '/expenses': 'http://localhost:8080',
      '/income': 'http://localhost:8080',
      '/summary': 'http://localhost:8080'
    }
  }
})
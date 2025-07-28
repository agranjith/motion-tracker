import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  base: '/motion-tracker/',
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    host: true, // This allows access from other devices on the network
  },
})

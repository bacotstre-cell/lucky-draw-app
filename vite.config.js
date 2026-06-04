import path from "path" // Tambahkan ini
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/lucky-draw-app/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Tambahkan ini
    },
  },
})
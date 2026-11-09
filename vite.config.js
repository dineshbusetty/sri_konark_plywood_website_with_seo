import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sri_konark_plywood_website_with_seo/',
  plugins: [react(), tailwindcss()],
})

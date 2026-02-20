import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    watch: {
      usePolling: true,
    },
    // This makes Vite listen on all local IPs (0.0.0.0), 
    // which typically resolves the localhost access issue.
    host: true, 
    port: 5173, // Ensure the port is correct
  }
})

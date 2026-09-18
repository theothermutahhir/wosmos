import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/dist',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // The browser talks to the Go server on this port; Go proxies both the
    // HTTP requests and the HMR websocket through to Vite, so the HMR client
    // must be told to reconnect on the port the browser actually sees.
    hmr: {
      clientPort: 8080,
    },
    // Bind-mounted source under Docker Desktop / some filesystems don't emit
    // inotify events reliably, so poll instead.
    watch: {
      usePolling: true,
    },
  },
})

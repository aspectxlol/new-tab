import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import path from 'path'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'New Tab',
  description: 'A new tab page',
  version: '1.0.0',
  action: {
    default_popup: 'index.html',
    default_title: 'New Tab',
  },
  chrome_url_overrides: {
    newtab: 'index.html',
  },
  permissions: ['history', 'bookmarks', 'tabs', 'downloads', 'downloads.open', 'topSites', 'identity'],
  oauth2: {
    client_id: '165335748683-cj02fqtj12sm6q8adcrog451srv47srh.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/tasks'],
  },
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'; frame-src https://s.tradingview.com",
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 👈 This makes `@/` point to `src/`
    },
  },
})

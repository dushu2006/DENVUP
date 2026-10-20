import { defineConfig } from 'vite';

/**
 * One client entry, many prerendered pages.
 *
 * `vite build` compiles the shared client and writes a manifest; the prerender
 * step then writes one real HTML file per route into dist/, each pointing at
 * the same hashed bundle. That keeps the route HTML static and avoids a
 * bundler-specific multi-page mapping.
 */
export default defineConfig({
  appType: 'mpa',
  server: { host: '0.0.0.0', port: 5173, strictPort: false, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 4173, strictPort: false, allowedHosts: true },
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
    manifest: true,
    rollupOptions: { input: 'index.html' },
  },
});

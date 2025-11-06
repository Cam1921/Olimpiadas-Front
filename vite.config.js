import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
     extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://nebulasoft.tis.cs.umss.edu.bo/', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
   build: {
    outDir: 'build',
    assetsDir: 'static',
  },
})

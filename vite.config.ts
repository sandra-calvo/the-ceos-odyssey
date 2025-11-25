import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This replaces process.env.API_KEY in the code with the string literal "__API_KEY__"
    // during the build. The Docker container will then swap this string for the real key.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "__API_KEY__"),
  },
  server: {
    host: true,
  }
});
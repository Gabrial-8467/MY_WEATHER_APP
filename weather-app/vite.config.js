import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from any network interface
    port: 5173,      // Specify the port you want to use
    open: true,      // Opens the app in the browser when server starts
    strictPort: true // Ensures that if the specified port is taken, the server will not start
  },
  build: {
    outDir: 'dist', // Directory for build output
    sourcemap: true, // Generates source maps
  },
  resolve: {
    alias: {
      '@': '/src', // Aliasing @ to /src directory for easier imports
    },
  },
});
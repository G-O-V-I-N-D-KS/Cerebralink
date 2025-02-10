
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['f7cd-2409-4073-4ecf-f2f2-8079-af84-c97d-1da6.ngrok-free.app'],
  },
});

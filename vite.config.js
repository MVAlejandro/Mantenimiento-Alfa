import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/maintenance/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                actives: resolve(__dirname, 'actives.html')
            }
        },
    },
});

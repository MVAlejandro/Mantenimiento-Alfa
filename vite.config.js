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
                actives: resolve(__dirname, 'actives.html'),
                spares: resolve(__dirname, 'spares.html'),
                suppliers: resolve(__dirname, 'suppliers.html'),
                tasks: resolve(__dirname, 'tasks.html'),
                planning: resolve(__dirname, 'planning.html'),
            }
        },
    },
});

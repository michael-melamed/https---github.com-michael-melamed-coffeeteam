import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'CoffeeTeam Pro',
                short_name: 'CoffeeTeam',
                description: 'P2P Order Management System',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    server: {
        host: true, // Allow external access (essential for phone testing)
        port: 3000,
        https: false // Set to true in production for Web Speech API/PWA
    },
    build: {
        target: 'es2020',
        outDir: 'dist',
        sourcemap: true
    }
});

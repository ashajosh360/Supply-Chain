import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    // Dynamically set base path
    base: isProduction ? process.env.VITE_BASE_PATH || './' : '/',
    
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 20000,
      sourcemap: true,
      // Optimize for production
      minify: isProduction ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
      },
    },
    
    plugins: [
      tsconfigPaths(), 
      react(),
      tagger(),
    ],
    
    server: {
      port: "4028",
      host: "0.0.0.0",
      strictPort: true,
      allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
      // Add headers for better compatibility
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    
    // For development proxy if needed
    preview: {
      port: 4028,
      host: true,
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
    
    // Resolve alias if needed
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});

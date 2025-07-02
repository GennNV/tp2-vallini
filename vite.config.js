// export default {
//   server: {
//     host: true,
//     port: 5173,
//   },
// };

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        pages: resolve(__dirname, "./src/pages/favorites.html"),
      },
    },
  },
});

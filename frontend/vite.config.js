import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        allPosts: path.resolve(__dirname, "all-posts.html"),
        about: path.resolve(__dirname, "about.html"),
        saved: path.resolve(__dirname, "saved.html"),
        dashboard: path.resolve(__dirname, "dashboard.html"),
        settings: path.resolve(__dirname, "settings.html"),
        post: path.resolve(__dirname, "post.html"),
        myPosts: path.resolve(__dirname, "my-posts.html"),
        write: path.resolve(__dirname, "write.html"),
        profile: path.resolve(__dirname, "profile.html"),
      },
    },
  }
});
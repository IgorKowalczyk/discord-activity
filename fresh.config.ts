import { defineConfig } from "$fresh/server.ts";
// import tailwind from "$fresh/plugins/tailwind.ts";
import tailwind from "@pakornv/fresh-plugin-tailwindcss";

export default defineConfig({
 plugins: [tailwind()],
});

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss()],
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				main: "index.html",
			},
		},
	},
});

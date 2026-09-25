import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
			"@pages": path.resolve(__dirname, "./client/scripts/pages"),
			"@config": path.resolve(__dirname, "./client/scripts/config"),
			"@utils": path.resolve(__dirname, "./client/scripts/utils"),
			"@errors": path.resolve(__dirname, "./client/scripts/errors"),
			"@services": path.resolve(__dirname, "./client/scripts/services"),
			"@components": path.resolve(__dirname, "./client/scripts/components"),
			"@controllers": path.resolve(__dirname, "./client/scripts/controllers"),
			"@layouts": path.resolve(__dirname, "./client/scripts/layouts"),
		},
	},
});

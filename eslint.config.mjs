import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	js.configs.recommended,

	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: {
			globals: globals.browser,
		},

		rules: {
			"no-unused-vars": "warn",
			semi: ["warn", "always"],
			quotes: ["warn", "double"],
		},
	},

	{
		files: ["server/**/*.{js,mjs,cjs}"],
		languageOptions: {
			globals: globals.node,
		},
	},
]);

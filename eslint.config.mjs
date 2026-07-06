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
			"no-unused-vars": "warn", // неиспользуемые переменные
			semi: ["warn", "always"], // требовать ;
			quotes: ["warn", "double"], // требовать двойные кавычки
		},
	},
]);

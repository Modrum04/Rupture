import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,

  // Règles React réservées aux composants : le code de src/legacy/ est du DOM natif.
  { ...react.configs.flat.recommended, files: ["**/*.jsx"] },
  { ...react.configs.flat["jsx-runtime"], files: ["**/*.jsx"] },
  { ...reactHooks.configs.flat["recommended-latest"], files: ["**/*.jsx"] },

  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    },
  },

  // Fichiers de configuration : exécutés par Node, pas par le navigateur.
  {
    files: ["vite.config.mjs", "eslint.config.mjs"],
    languageOptions: {
      globals: globals.node,
    },
  },
];

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "vite.config.mjs"],
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Nouveau transform JSX de React 19 : plus besoin d'importer React.
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
  },
};

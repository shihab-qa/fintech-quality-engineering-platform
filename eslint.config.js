import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules",
      "playwright-report",
      "test-results",
      "blob-report",
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },

  {
    files: ["sut/server.js"],

    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
      },
    },
  },

  {
    files: ["sut/public/**/*.js"],

    languageOptions: {
      globals: {
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        window: "readonly",
      },
    },
  },

  {
    files: ["performance/**/*.js"],

    languageOptions: {
      globals: {
        __ENV: "readonly",
      },
    },
  },
);

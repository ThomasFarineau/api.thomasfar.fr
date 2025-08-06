import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import decoratorPosition from "eslint-plugin-decorator-position";

export default [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "decorator-position": decoratorPosition
    },
    rules: {
      indent: ["error", 2],
      "prefer-template": "error",

      "object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            multiline: true,
            minProperties: 2,
            consistent: true
          }
        }
      ],
      "array-element-newline": [
        "error",
        {
          ArrayExpression: "consistent"
        }
      ],
      "lines-between-class-members": ["error", "always"],
      "comma-dangle": ["error", "never"],
      "decorator-position/decorator-position": [
        "error",
        {
          printWidth: 1,
          properties: "prefer-inline",
          methods: "above"
        }
      ],
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];

import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import decoratorPosition from "eslint-plugin-decorator-position";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2020,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "decorator-position": decoratorPosition
    },
    rules: {
      /* ===== import ordering ===== */
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc", caseInsensitive: true 
          },
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "index"],
          "newlines-between": "always"
        }
      ],

      /* ===== general styling ===== */
      indent: ["error", 2],
      "no-multiple-empty-lines": ["error", {
        max: 1, maxEOF: 1 
      }],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always", prev: "*", next: "export" 
        },
        {
          blankLine: "always", prev: "export", next: "*" 
        }
      ],
      "prefer-template": "error",
      "comma-dangle": ["error", "never"],

      /* ===== objects/arrays/functions ===== */
      "object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            multiline: true, minProperties: 2, consistent: true 
          },
          ObjectPattern:    {
            multiline: true, minProperties: 2, consistent: true 
          },
          ImportDeclaration:{ consistent: true },
          ExportDeclaration:{ consistent: true }
        }
      ],
      "array-element-newline": ["error", { ArrayExpression: "consistent" }],
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true, allowTypedFunctionExpressions: true 
        }
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit", overrides: { constructors: "no-public" } 
        }
      ],

      /* ===== decorators ===== */
      "decorator-position/decorator-position": [
        "error",
        {
          printWidth: 80, properties: "prefer-inline", methods: "above" 
        }
      ],

      /* ===== class member order ===== */
      "@typescript-eslint/member-ordering": [
        "error",
        {
          default: [
            "static-field",
            "instance-field",
            "static-method",
            "instance-method"
          ]
        }
      ],

      /* ===== unused vars ===== */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", varsIgnorePattern: "^_" 
        }
      ]
    }
  }
];

/* eslint-env node */
module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ['@typescript-eslint'],
  root: true,
  settings: {
    "import/resolver": {
      node: {
        "extensions": [
          ".ts",
          ".js",
          ".json"
        ]
      }
    },
    "import/extensions": [
      ".js",
      ".ts"
    ]
  },
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "ts": "never"
      }
    ],
    "no-underscore-dangle": "off"
  },
};

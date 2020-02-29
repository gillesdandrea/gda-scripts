const fs = require('fs');
const path = require('path');

module.exports = {
  parser: 'babel-eslint',

  extends: [
    'airbnb', // includes react and flowtype
    // 'plugin:@typescript-eslint/recommended', // TODO
    'plugin:prettier/recommended',
    // 'prettier/@typescript-eslint', // TODO
    'prettier/flowtype',
    'prettier/react',
  ],

  // plugins: [
  // '@typescript-eslint', // TODO
  // ],

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    'arrow-body-style': ['warn', 'as-needed', { requireReturnForObjectLiteral: false }],
    'class-methods-use-this': 'warn', // I want some method not to be static
    'linebreak-style': 'off', // be kind with windows users
    'no-prototype-builtins': 'off', // to use hasOwnProperty
    'no-else-return': 'warn', // sometimes code looks prettier with `else`
    'no-param-reassign': 'warn',
    'no-plusplus': 'off', // for (let i = 0; i < 10; i++)
    'no-return-assign': ['error', 'except-parens'],
    'no-unused-vars': ['warn', { vars: 'local', args: 'after-used', ignoreRestSiblings: true }],
    'prefer-template': 'warn',
    'react/destructuring-assignment': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'], // TODO '.ts', '.tsx'
      },
    },
  },
};

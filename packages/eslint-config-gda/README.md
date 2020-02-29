# eslint-config-gda

This package includes the shareable [ESLint](https://eslint.org/) configuration used by [gda-scripts](https://github.com/gillesdandrea/gda-scripts).

Extends:

- [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) (includes react and flow)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

And adds few rules relaxations...

## Usage

First, install [ESLint](https://eslint.org/docs/user-guide/getting-started) and [Prettier](https://prettier.io/docs/en/install.html)

Then install `eslint-config-gda` and it peers dependencies

```
npm install eslint-config-gda eslint-config-airbnb eslint-config-prettier eslint-plugin-flowtype eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react --save-dev
```

Then create a file named `.eslintrc` with following contents in the root folder of your project:

```
{
  "extends": ["gda"]
}
```

Then create a file name `.prettierrc` with following contents in the root folder of your project:

```
{
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

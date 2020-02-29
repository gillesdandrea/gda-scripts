# eslint-config-gda

This package includes the shareable [stylelint](https://stylelint.io/) configuration used by [gda-scripts](https://github.com/gillesdandrea/gda-scripts).

Extends:

- [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)
- [stylelint-config-recommended-scss](https://github.com/kristerkari/stylelint-config-recommended-scss)
- [stylelint-config-rational-order](https://github.com/constverum/stylelint-config-rational-order)
- [stylelint-prettier](https://github.com/prettier/stylelint-prettier)

## Usage

First, install [stylelint](https://stylelint.io/user-guide/cli/) and [Prettier](https://prettier.io/docs/en/install.html)

Then install `stylelint-config-gda` and it peers dependencies

```
npm install stylelint-config-gda stylelint-config-standard stylelint-config-recommended-scss stylelint-config-rational-order stylelint-prettier --save-dev
```

Then create a file named `.stylelintrc` with following contents in the root folder of your project:

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

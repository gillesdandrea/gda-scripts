const fs = require('fs');
const path = require('path');

const webpackConfig = require('../../webpack.config');

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json')));

module.exports = webpackConfig(pkg, {
  mode: 'storybook',
  babelPlugins: [
    // TODO maybe some plugins below should be in core gda-scripts
    // as seen in https://github.com/storybooks/storybook/blob/next/examples/official-storybook/webpack.config.js
    ['babel-plugin-emotion', { sourceMap: true, autoLabel: true }],
    'babel-plugin-macros',
    '@babel/plugin-transform-react-constant-elements',
    'babel-plugin-add-react-displayname',
    ['babel-plugin-react-docgen', { DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES' }],
  ],
});

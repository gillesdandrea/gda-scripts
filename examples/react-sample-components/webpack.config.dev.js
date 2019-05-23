/* eslint-disable import/no-extraneous-dependencies */
const webpackConfig = require('gda-scripts/config/webpack.config');
const pkg = require('./package.json');

module.exports = webpackConfig(pkg, {
  mode: 'development',
  input: './src/App.jsx',
});

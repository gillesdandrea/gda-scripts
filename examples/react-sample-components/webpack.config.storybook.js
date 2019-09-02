/* eslint-disable import/no-extraneous-dependencies */
const configure = require('gda-scripts/config/webpack.configure');
const pkg = require('./package.json');

module.exports = configure(pkg, {
  // 'print-config': true,
  mode: 'storybook',
  // babel: {
  //   presets: ['@babel/env', '@babel/react'],
  //   plugins: ['@babel/plugin-proposal-export-default-from'],
  // },
});

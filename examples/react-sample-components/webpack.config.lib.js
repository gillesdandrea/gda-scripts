/* eslint-disable import/no-extraneous-dependencies */
const configure = require('gda-scripts/config/webpack.configure');
const pkg = require('./package.json');

module.exports = configure(pkg, {
  // 'print-config': true,
  mode: 'production',
  sourcemap: true,
  minimize: false,
  monitor: false,
});

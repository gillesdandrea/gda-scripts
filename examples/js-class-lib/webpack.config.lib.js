/* eslint-disable import/no-extraneous-dependencies */
const configure = require('gda-scripts/config/webpack.configure');
const pkg = require('./package.json');

module.exports = configure(pkg, {
  // 'print-config': true,
  mode: 'production',
  sourcemap: true,
  minimize: false,
  // browserslist: ['defaults'],
  // babel: {
  //   corejs: 3,
  //   useBuiltIns: 'entry',
  //   helpers: true,
  // },
  monitor: false,
});

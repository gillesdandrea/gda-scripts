const fs = require('fs');
const path = require('path');

const webpackConfig = require('../webpack.config');

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json')));

module.exports = webpackConfig(pkg, {
  mode: 'storybook',
});

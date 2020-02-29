const fs = require('fs');
const path = require('path');

const configure = require('../../webpack.configure');

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json')));

module.exports = configure(pkg, {
  mode: 'storybook',
});

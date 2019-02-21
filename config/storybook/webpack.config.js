/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const src = path.resolve(process.cwd(), './src');

const configPath = path.resolve(process.cwd(), './webpack.config.storybook.js');
const config = fs.existsSync(configPath) ? require(configPath) : require('./webpack.config.storybook.js');

// console.log(config);
// process.exit();

module.exports = {
  ...config,
  plugins: [
    ...(config.plugins || []), //
    new webpack.ContextReplacementPlugin(/STORIES/, src), // to find stories in right directory
  ],
};

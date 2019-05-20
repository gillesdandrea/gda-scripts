/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-param-reassign */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const src = path.resolve(process.cwd(), './src');

const configPath = path.resolve(process.cwd(), './webpack.config.storybook.js');
const custom = fs.existsSync(configPath) ? require(configPath) : require('./webpack.config.storybook.js');

// console.log(config);
// process.exit();

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) =>
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.
  // console.dir(config.module.rules, { depth: null });

  // Return the altered config
  ({
    ...config,
    // devtool: 'source-map',
    resolve: {
      ...custom.resolve,
      alias: {
        ...custom.resolve.alias,
        ...config.resolve.alias,
      },
    },
    module: {
      ...(config.module || {}),
      rules: [
        // get at least scss loader
        ...(custom.module.rules || []).filter(rule => '.scss'.match(rule.test)),
        ...(config.module.rules || []), //
      ],
    },
    plugins: [
      ...(custom.plugins || []), //
      ...(config.plugins || []), //
      new webpack.ContextReplacementPlugin(/STORIES/, src), // to find stories in right directory
    ],
  });

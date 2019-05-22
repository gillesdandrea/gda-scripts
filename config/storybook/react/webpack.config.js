/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-param-reassign */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

// const corejsPath = require.resolve('core-js');
const src = path.resolve(process.cwd(), './src');

const configPath = path.resolve(process.cwd(), './webpack.config.storybook.js');
const custom = fs.existsSync(configPath) ? require(configPath) : require('./webpack.config.storybook.js');

// console.log(config);
// process.exit();

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.
  // console.log('storybook:');
  // console.dir(config.module.rules, { depth: null });

  // Return the altered config
  const mergedConfig = {
    ...config,
    // devtool: 'source-map',
    resolve: {
      ...custom.resolve,
      alias: {
        ...custom.resolve.alias,
        ...config.resolve.alias,
        // 'core-js': path.dirname(corejsPath), // force storybook to use core-js@3
      },
    },
    module: {
      ...(config.module || {}),
      rules: [
        // keep (s)css and babel loader
        ...(custom.module.rules || []).filter(
          rule => '.scss'.match(rule.test) || '.css'.match(rule.test) || rule.loader === 'babel-loader'
        ),
        ...(config.module.rules || []).filter(
          rule => '.scss'.match(rule.test) && '.css'.match(rule.test) && rule.loader !== 'babel-loader'
        ),
        {
          test: /[.-]stor(y|ies)\.jsx?$/,
          loaders: [require.resolve('@storybook/addon-storysource/loader')],
          enforce: 'pre',
        },
      ],
    },
    plugins: [
      ...(custom.plugins || []), //
      ...(config.plugins || []), //
      new webpack.ContextReplacementPlugin(/STORIES/, src), // to find stories in right directory
    ],
  };
  // console.log('merged:');
  // console.dir(mergedConfig.resolve, { depth: null });
  return mergedConfig;
};

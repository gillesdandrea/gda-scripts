/* eslint-disable no-console */

// const fs = require('fs');
const path = require('path');

const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolveConfig = require('../src/resolveConfig');
const isMonorepo = require('../src/isMonorepo');

let WebpackMonitor = null;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  WebpackMonitor = require('webpack-monitor');
} catch (e) {
  WebpackMonitor = null;
}

// do we use webpack or webpack-dev-server?
const webpackDevServer = process.argv[1].includes('webpack-dev-server');

const monorepo = isMonorepo(process.cwd());

const nodeModules = [
  path.join(process.cwd(), 'node_modules'), // get peers dependencies from project we compile
  monorepo && path.join(process.cwd(), '../../node_modules'), // in monorepo shared node_modules
  path.join(__dirname, '../node_modules'), // in gda-scripts/node_modules
  'node_modules', // get dependencies as usual
].filter(Boolean);
// console.log(nodeModules);

const storybookBabelPlugins = [
  // TODO maybe some plugins below should be in core gda-scripts
  // as seen in https://github.com/storybooks/storybook/blob/next/examples/official-storybook/webpack.config.js
  ['babel-plugin-emotion', { sourceMap: true, autoLabel: true }],
  'babel-plugin-macros',
  '@babel/plugin-transform-react-constant-elements',
  'babel-plugin-add-react-displayname',
  ['babel-plugin-react-docgen', { DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES' }],
];

// TODO babelrc is not (yet) based on user one
const getBabelConfig = (
  { 'print-config': printConfig, mode, browserslist, babel: { corejs = 2, helpers = false, debug, ...babel } },
  server = false
) => ({
  ...babel,
  // rootMode: babel.rootMode || (monorepo ? 'upwards' : undefined), // not compatible with babelrc: false
  presets: babel.presets || [
    [
      'gda',
      {
        // 'print-config': printConfig,
        corejs,
        modules: false,
        transformRuntime: helpers && !server,
        targets: { browsers: browserslist },
        debug,
      },
    ],
  ],
  plugins: mode === 'storybook' ? [...(babel.plugins || []), ...storybookBabelPlugins] : babel.plugins,
  babelrc: false || babel.babelrc,
});

const DEFAULT_ROOTS = {
  lodash: '_',
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
};

// note: lodash/isEqual will not be externalized, see https://webpack.js.org/guides/author-libraries/
function getExternals(peers = {}, externalRoots = {}) {
  const combinedRoots = { ...DEFAULT_ROOTS, ...externalRoots };
  const combinedDependencies = { ...externalRoots, ...peers }; // cheap set to avoid duplicates
  const externals = Object.keys(combinedDependencies).map(name => ({
    [name]: {
      root: combinedRoots[name],
      commonjs2: name,
      commonjs: name,
      amd: name,
    },
  }));
  return externals;
}

const getOutputName = pkg => (pkg.name ? pkg.name.substring(pkg.name.indexOf('/') + 1) : 'bundle');

const getConfig = (pkg, { webpack = {}, babel = {}, styling = {}, server = {}, html = {}, ...config }) => ({
  mode: config.mode || 'development',
  input: config.input || './src/index',
  outputPath: config.outputPath || './dist',
  outputName: config.outputName || getOutputName(pkg),
  outputSuffix: config.outputSuffix || '', // i.e. '.min' when minimize = true
  publicPath: config.publicPath,
  library: config.library || pkg.name,
  format: config.format || 'umd',
  debug: config.debug, // undefined, true or false
  sourcemap: config.sourcemap, // undefined, true or false, or 'source-map', etc.
  minimize: config.minimize, // undefined, true or false
  browserslist: config.browserslist || resolveConfig('browserslist').config.browserslist,
  //
  webpack: {
    ...webpack,
    resolve: {
      ...(webpack.resolve || {}),
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      mainFields:
        webpack.resolve && webpack.resolve.mainFields && webpack.resolve.mainFields.length > 0
          ? [...webpack.resolve.mainFields, 'module', 'browser', 'main']
          : undefined,
      modules: webpack.resolve && webpack.resolve.modules ? [...nodeModules, ...webpack.resolve.modules] : nodeModules,
      alias: (webpack.resolve && webpack.resolve.alias) || {},
    },
    optimization: webpack.optimization || undefined,
    externals: getExternals(pkg.peerDependencies, webpack.externals) || {},
    define: webpack.define || {},
    modules: {
      rules: [],
      ...(webpack.modules || {}),
    },
    plugins: webpack.plugins || [],
    // copy: webpack.copy,
  },
  //
  babel, // see getBabelConfig()
  //
  styling: {
    ...styling,
    publicPath: styling.publicPath || './',
    define: styling.define || {},
    fonts: {
      name: './fonts/[name]--[hash:6].[ext]',
      ...(styling.fonts || {}),
    },
    images: {
      name: './images/[name]--[hash:6].[ext]',
      ...(styling.images || {}),
    },
  },
  server: {
    https: true,
    host: 'localhost',
    port: 8080,
    publicPath: config.publicPath,
    // respond to 404s with index.html
    historyApiFallback: false,
    // enable HMR on the server
    inline: true,
    hot: true,
    ...server,
  },
  html: {
    generate: undefined, // undefined is auto
    template: HtmlWebpackTemplate,
    title: pkg.description || pkg.name || 'webpack-dev-server',
    favicon: false,
    filename: 'index.html',
    appMountId: 'root', // Generate #root where to mount
    mobile: true, // Scale page on mobile
    inject: false, // html-webpack-template needs this to work
    minify: {
      collapseWhitespace: true,
      conservativeCollapse: true,
      preserveLineBreaks: true,
    },
    ...html,
  },
  monitor: config.monitor || false,
});

function webpackConfigure(pkg, cfg) {
  const c = getConfig(pkg, cfg);
  const storybook = c.mode === 'storybook';
  const server = webpackDevServer;
  const createLibrary = !server && !storybook;
  process.env.NODE_ENV = process.env.NODE_ENV || (storybook ? 'development' : c.mode);
  const dev = process.env.NODE_ENV === 'development';
  process.env.DEBUG = process.env.DEBUG || !!(c.debug === undefined ? dev : c.debug);
  const minimized = !!(c.minimize === undefined ? !dev : c.minimize);
  const sourcemap = c.sourcemap === undefined ? !!dev : c.sourcemap;
  if (createLibrary && c.monitor && !WebpackMonitor) {
    console.log('WARNING: Missing webpack-monitor, try `yarn add -D webpack-monitor`');
  }
  if (!storybook && !cfg['print-config']) {
    console.log(`Running from ${process.cwd()}`);
    console.log({
      server,
      mode: process.env.NODE_ENV,
      debug: process.env.DEBUG,
      createLibrary,
      minimized,
      sourcemap,
      input: c.input,
      outputName: `${c.outputName}${c.outputSuffix}`,
      externals: createLibrary ? c.webpack.externals.map(external => Object.keys(external)[0]) : undefined,
    });
  }
  const babel = getBabelConfig(c, server);
  const { resolve = {}, optimization = {}, module: { rules = [], ...modules } = {}, plugins = [] } = c.webpack;
  const { generate = server, ...html } = c.html;
  const config = {
    mode: process.env.NODE_ENV,
    entry: c.input,
    output: {
      path: path.resolve(process.cwd(), c.outputPath),
      filename: `${c.outputName}${c.outputSuffix}.js`,
      chunkFilename: `${c.outputName}-[name]${c.outputSuffix}.js`,
      library: createLibrary ? c.library : undefined,
      libraryTarget: createLibrary ? c.format : undefined,
      globalObject: createLibrary ? "typeof self !== 'undefined' ? self : this" : undefined, // https://github.com/webpack/webpack/issues/6522
      publicPath: createLibrary ? c.publicPath : undefined,
    },
    devtool: sourcemap === true ? 'source-map' : sourcemap || false,
    optimization: c.minimize !== undefined ? { minimize: minimized, ...optimization } : optimization,
    resolve,
    externals: createLibrary ? c.webpack.externals : undefined,
    module: {
      rules: [
        sourcemap && {
          test: /\.[jt]sx?$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules(?!\/.+\/src)/, // will compile `src` even in node_modules
          loader: 'babel-loader',
          options: babel,
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: c.styling.publicPath,
                hmr: server,
              },
            },
            { loader: 'css-loader', options: { sourceMap: !!sourcemap } },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: { browsers: c.browserslist, minimize: minimized },
                  path: path.resolve(__dirname, './postcss.config.js'), // TODO find user config
                },
                sourceMap: !!sourcemap,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !!sourcemap,
                includePaths: nodeModules,
              },
            },
            {
              loader: '@epegzz/sass-vars-loader',
              options: {
                syntax: 'scss',
                vars: c.styling.define,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: c.styling.publicPath,
                hmr: server,
              },
            },
            { loader: 'css-loader', options: { sourceMap: !!sourcemap } },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: { browsers: c.browserslist, minimize: minimized },
                  path: path.resolve(__dirname, './postcss.config.js'), // TODO find user config
                },
                sourceMap: !!sourcemap,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          loader: 'url-loader',
          options: c.styling.images,
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: c.styling.images,
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: '10000',
            mimetype: 'application/font-woff',
            ...c.styling.fonts,
          },
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: '10000',
            mimetype: 'application/octet-stream',
            ...c.styling.fonts,
          },
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            ...c.styling.fonts,
          },
        },
        ...rules,
      ].filter(Boolean),
      ...modules,
    },
    plugins: [
      createLibrary &&
        c.monitor &&
        WebpackMonitor &&
        new WebpackMonitor({
          capture: true,
          launch: true,
          port: 8090,
        }),

      // enable HMR globally
      server && new Webpack.HotModuleReplacementPlugin(),

      // prints more readable module names in the browser console on HMR updates
      server && new Webpack.NamedModulesPlugin(),

      // do not emit compiled assets that include errors
      server && new Webpack.NoEmitOnErrorsPlugin(),

      (server || generate) && new HtmlWebpackPlugin(html),

      new Webpack.DefinePlugin({
        NAME: JSON.stringify(pkg.name),
        VERSION: JSON.stringify(pkg.version),
        REPOSITORY: JSON.stringify((pkg.repository && pkg.repository.url) || pkg.repository),
        ...c.define,
      }),

      new Webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),

      c.webpack.copy && new CopyWebpackPlugin(c.webpack.copy),

      new MiniCssExtractPlugin({
        path: path.resolve(process.cwd(), c.outputPath),
        filename: `${c.outputName}${c.outputSuffix}.css`,
        chunkFilename: `${c.outputName}-[name]${c.outputSuffix}.css`,
      }),

      ...plugins,
    ].filter(Boolean),
    devServer: server ? c.server : undefined,
  };
  if (cfg['print-config']) {
    console.log(JSON.stringify(config, null, 2));
  }
  return config;
}

module.exports = webpackConfigure;

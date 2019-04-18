/* eslint-disable no-console */

// const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolveConfig = require('../src/resolveConfig');

let WebpackMonitor = null;
try {
  WebpackMonitor = require('webpack-monitor'); // eslint-disable-line global-require, import/no-unresolved
} catch (e) {
  WebpackMonitor = null;
}

const webpackDevServer = process.argv[1].includes('webpack-dev-server');

// TODO babelrc is not based yet based on user one
const babelrc = (babelHelpers, browsers) => ({
  presets: [
    [
      'gda',
      {
        modules: false,
        targets: { browsers },
        // debug: true,
      },
    ],
  ],
  plugins: babelHelpers ? ['@babel/plugin-transform-runtime'] : undefined,
});
// const browserslistrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, './.browserslistrc'))).browserslist;
const browserslistrc = resolveConfig('browserslist').config.browserslist;

const DEFAULT_ROOTS = {
  lodash: '_',
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
};

// note: lodash/isEqual will not be externalized, see https://webpack.js.org/guides/author-libraries/
function getExternals(dependencies = {}, roots = {}) {
  const combinedRoots = { ...DEFAULT_ROOTS, ...roots };
  const externals = Object.keys(dependencies).map(name => ({
    [name]: {
      root: combinedRoots[name],
      commonjs2: name,
      commonjs: name,
      amd: name,
    },
  }));
  return externals;
}

function webpackConfig(
  pkg,
  {
    mode = 'development', // 'production' or 'development' or 'storybook'
    input = './src/index',
    outputPath = './dist',
    outputName = undefined, // use pkg.name
    publicPath = undefined,
    library = undefined, // use pkg.name
    format = 'umd',
    debug = undefined, // undefined, true or false
    sourcemap = undefined, // undefined, true or false
    minimize = undefined, // undefined, true or false
    extractCSS = true,
    // babel = babelrc,
    browserslist = browserslistrc,
    babelHelpers = false,
    define = {},
    sassDefine = {},
    options = {},
    alias = undefined,
    externals = {},
    copy = [],
    html = false,
    title = undefined,
    https = true,
    port = 8080,
    headers = undefined,
    monitor = false,
    mainFields = [],
  } = {}
) {
  // eslint-disable-next-line no-param-reassign
  externals = getExternals(pkg.peerDependencies, externals);
  const storybook = mode === 'storybook';
  const server = webpackDevServer;
  const createLibrary = !server && !storybook;
  process.env.NODE_ENV = process.env.NODE_ENV || (storybook ? 'development' : mode);
  const dev = process.env.NODE_ENV === 'development';
  process.env.DEBUG = process.env.DEBUG || !!(debug === undefined ? dev : debug);
  const minimized = !!(minimize === undefined ? !dev : minimize);
  const sourceMapped = sourcemap === undefined ? !!dev : sourcemap;
  outputName = outputName || pkg.name.substring(pkg.name.indexOf('/') + 1); // eslint-disable-line no-param-reassign
  if (createLibrary && monitor && !WebpackMonitor) {
    console.log('WARNING: Missing webpack-monitor, try `yarn add -D webpack-monitor`');
  }
  if (!storybook) {
    console.log({
      server,
      mode: process.env.NODE_ENV,
      debug: process.env.DEBUG,
      createLibrary,
      minimized,
      sourceMapped,
      outputName,
    });
  }
  const config = {
    mode: storybook ? undefined : process.env.NODE_ENV,
    entry: storybook
      ? undefined
      : [
          // bundle the client for webpack-dev-server
          // and connect to the provided endpoint
          server && `webpack-dev-server/client?${https ? 'https' : 'http'}://localhost:${port}`,

          // bundle the client for hot reloading
          // only- means to only hot reload for successful updates
          server && 'webpack/hot/only-dev-server',

          // the entry point of our app
          input,
        ].filter(Boolean),
    output: storybook
      ? undefined
      : {
          path: path.resolve(process.cwd(), outputPath),
          filename: `${outputName}.js`,
          chunkFilename: `${outputName}-[name].js`,
          library: createLibrary ? library || pkg.name : undefined,
          libraryTarget: createLibrary ? format : undefined,
          globalObject: createLibrary ? "typeof self !== 'undefined' ? self : this" : undefined, // https://github.com/webpack/webpack/issues/6522
          publicPath: createLibrary ? publicPath : undefined,
        },
    devtool: sourceMapped === true ? 'source-map' : sourceMapped || false,
    optimization: { minimize },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: mainFields.length > 0 ? [...mainFields, 'module', 'browser', 'main'] : undefined,
      modules: [
        path.join(process.cwd(), 'node_modules'), // get peers dependencies from project we compile
        'node_modules', // get dependencies as usual
        path.join(process.cwd(), '../../node_modules'), // TODO should be enabled only with workspaces
        path.join(__dirname, '../node_modules'), // in gda-scripts/node_modules
      ],
      alias: {
        ...(dev
          ? {
              'react-dom': '@hot-loader/react-dom',
            }
          : {}),
        ...alias,
      },
    },
    externals: createLibrary ? externals : undefined,
    module: {
      rules: [
        sourceMapped && {
          test: /\.[jt]sx?$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules(?!\/.+\/src)/, // will compile `src` even in node_modules
          loader: 'babel-loader',
          options: babelrc(babelHelpers, browserslist),
        },
        {
          test: /\.s?css$/,
          use: [
            !createLibrary || !extractCSS
              ? { loader: 'style-loader' }
              : { loader: MiniCssExtractPlugin.loader, options: { publicPath: '' } },
            { loader: 'css-loader', options: { sourceMap: !!sourceMapped } },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: { browsers: browserslist, minimize: minimized },
                  path: path.resolve(__dirname, './postcss.config.js'),
                },
                sourceMap: !!sourceMapped,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !!sourceMapped,
                includePaths: [
                  'node_modules', // path.join(process.cwd(), 'node_modules'),
                  path.join(__dirname, '../node_modules'), // in gda-scripts/node_modules
                  path.join(process.cwd(), '../../node_modules'), // TODO check if we are using workspace
                ],
              },
            },
            {
              loader: '@epegzz/sass-vars-loader',
              options: {
                syntax: 'scss',
                vars: sassDefine,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          loader: 'url-loader',
          options: {
            name: './images/[name]--[hash:6].[ext]',
            ...options.images,
          },
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            name: './images/[name]--[hash:6].[ext]',
            ...options.images,
          },
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: '10000',
            mimetype: 'application/font-woff',
            name: './fonts/[name]--[hash:6].[ext]',
            ...(options.fonts || {}),
          },
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: '10000',
            mimetype: 'application/octet-stream',
            name: './fonts/[name]--[hash:6].[ext]',
            ...(options.fonts || {}),
          },
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: './fonts/[name]--[hash:6].[ext]',
            ...(options.fonts || {}),
          },
        },
      ].filter(Boolean),
    },
    plugins: [
      createLibrary &&
        monitor &&
        WebpackMonitor &&
        new WebpackMonitor({
          capture: true,
          launch: true,
          port: 8090,
        }),

      // enable HMR globally
      server && new webpack.HotModuleReplacementPlugin(),

      // prints more readable module names in the browser console on HMR updates
      server && new webpack.NamedModulesPlugin(),

      // do not emit compiled assets that include errors
      server && new webpack.NoEmitOnErrorsPlugin(),

      (server || html) &&
        new HtmlWebpackPlugin({
          template: HtmlWebpackTemplate,
          title: title || pkg.description || pkg.name || 'webpack-dev-server',
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
        }),

      new webpack.DefinePlugin({
        NAME: JSON.stringify(pkg.name),
        VERSION: JSON.stringify(pkg.version),
        REPOSITORY: JSON.stringify((pkg.repository && pkg.repository.url) || pkg.repository),
        ...define,
      }),

      new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),

      new CopyWebpackPlugin(copy),

      createLibrary &&
        extractCSS &&
        new MiniCssExtractPlugin({
          path: path.resolve(process.cwd(), outputPath),
          filename: `${outputName}.css`,
          chunkFilename: `${outputName}-[name].css`,
        }),
    ].filter(Boolean),
    devServer: server
      ? {
          host: 'localhost',
          https,
          port,
          publicPath,
          headers,

          // respond to 404s with index.html
          historyApiFallback: false,

          // enable HMR on the server
          hot: true,
        }
      : undefined,
  };
  // console.log(config);
  return config;
}

module.exports = webpackConfig;

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = ({ file, options, env }) => ({
  autoprefixer: {
    browsers: options.browsers,
  },
  // The plugins section is used by postcss-loader with webpack
  plugins: [
    autoprefixer,
    options.minimize &&
      cssnano({
        preset: 'default',
      }),
  ].filter(Boolean),
});

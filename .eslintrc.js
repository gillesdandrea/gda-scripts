// module.exports = require('./config/.eslintrc.js');
module.exports = {
  extends: ['./packages/gda-scripts/config/.eslintrc.js'].map(require.resolve),
  rules: {},
};

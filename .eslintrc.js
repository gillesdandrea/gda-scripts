// module.exports = require('./packages/gda-scripts/config/.eslintrc.js');
module.exports = {
  extends: ['./packages/gda-scripts/config/.eslintrc.js'].map(require.resolve),
  rules: {},
};

// module.exports = require('gda-scripts/config/.stylelintrc.js');
module.exports = {
  extends: ['gda-scripts/config/.stylelintrc.js'].map(require.resolve),
  rules: {},
};

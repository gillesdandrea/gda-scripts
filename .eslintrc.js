// module.exports = require('./config/.eslintrc.js');
module.exports = {
  extends: ['./config/.eslintrc.js'].map(require.resolve),
  rules: {},
};

/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */

// TODO should support command line for stage-lint i.e. gda-scripts format --prettier-lint <file>

const execute = require('../src/execute');
const resolveConfig = require('../src/resolveConfig');
const resolvePaths = require('../src/resolvePaths');

const { config } = resolveConfig('format');

function sortpackagejson(patterns) {
  return execute('node', [require.resolve(`./sort-package-json`)].concat(patterns), null, false);
}

function importsort(patterns) {
  return execute('node', [require.resolve(`./import-sort`), '--write'].concat(patterns), null, false);
}

function prettier(patterns) {
  return execute('node', [require.resolve(`./prettier`), '--write'].concat(patterns), null, false);
}

function eslint(patterns) {
  return execute('node', [require.resolve(`./eslint`), '--fix'].concat(patterns), null, false);
}

function stylelint(patterns) {
  return execute('node', [require.resolve(`./stylelint`), '--fix'].concat(patterns), null, false);
}

const actions = Object.keys(config).map(formatter => {
  const patterns = resolvePaths(formatter, config);
  return { formatter, patterns };
});

actions.forEach(action => {
  if (action.patterns.length > 0) {
    switch (action.formatter) {
      case 'sort-package-json':
        sortpackagejson(action.patterns);
        break;
      case 'prettier':
        prettier(action.patterns);
        break;
      case 'prettier-eslint':
        importsort(action.patterns);
        prettier(action.patterns);
        eslint(action.patterns);
        break;
      case 'prettier-stylelint':
        prettier(action.patterns);
        stylelint(action.patterns);
        break;
      default:
        console.warn(`Unkown formatter ${action.formatter}`);
        break;
    }
  }
});

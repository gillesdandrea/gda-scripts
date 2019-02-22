/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */

const glob = require('fast-glob');

const execute = require('../src/execute');
const resolveConfig = require('../src/resolveConfig');

const { config } = resolveConfig('format');

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

const split = (pattern, suffix = '/') => {
  if (!pattern || pattern === '.') {
    return [''];
  }
  const tokens = pattern.split(',').filter(token => token);
  if (tokens.includes('.')) {
    const ntokens = tokens.filter(token => token !== '.');
    return ['', ntokens.length === 1 ? `${ntokens[0]}${suffix}` : `{${ntokens.join(',')}}${suffix}`];
  }
  return tokens.length === 1 ? [`${tokens[0]}/`] : [`{${tokens.join(',')}}${suffix}`];
};

const actions = Object.keys(config).map(formatter => {
  const entries = config[formatter];
  const patterns = entries.map(entry => {
    const exts = split(entry.exts, '');
    const paths = split(entry.paths);
    const prefixes = split(entry.prefixes);
    const ppes = [];
    for (const prefix of prefixes) {
      for (const path of paths) {
        for (const ext of exts) {
          const pattern = `${prefix}${path}${ext}`;
          if (pattern) {
            ppes.push(pattern);
          }
        }
      }
    }
    return ppes || ['.'];
  });
  const epatterns = patterns.reduce((acc, val) => acc.concat(val), []).filter(pattern => glob.sync(pattern).length > 0);
  return { formatter, patterns: epatterns };
});

actions.forEach(action => {
  if (action.patterns.length > 0) {
    switch (action.formatter) {
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

/* eslint-disable no-restricted-syntax */

const glob = require('fast-glob');

const resolveConfig = require('./resolveConfig');

const split = (pattern, suffix = '/') => {
  if (!pattern || pattern === '.') {
    return [''];
  }
  const tokens = pattern.split(',').filter(token => token);
  if (tokens.includes('.')) {
    const ntokens = tokens.filter(token => token !== '.');
    return ['', ntokens.length === 1 ? `${ntokens[0]}${suffix}` : `{${ntokens.join(',')}}${suffix}`];
  }
  return tokens.length === 1 ? [`${tokens[0]}`] : [`{${tokens.join(',')}}${suffix}`];
};

// descriptions = [{ files, paths, prefixes }, ...] // , separated string
const getPatterns = descriptions => {
  const patterns = descriptions.map(description => {
    const files = split(description.files || description.exts, ''); // keep exts as legacy
    const paths = split(description.paths);
    const prefixes = split(description.prefixes);
    const elements = [];
    for (const prefix of prefixes) {
      for (const path of paths) {
        for (const file of files) {
          const pattern = `${prefix}${path}${file}`;
          if (pattern) {
            elements.push(pattern);
          }
        }
      }
    }
    return elements || ['.'];
  });
  const epatterns = patterns
    .reduce((acc, val) => acc.concat(val), [])
    .filter(pattern => glob.sync(pattern, { onlyFiles: false }).length > 0);
  return epatterns;
};

function resolvePaths(formatter, config = resolveConfig('format').config) {
  const descriptions = config[formatter];
  return descriptions ? getPatterns(descriptions) : [];
}

module.exports = resolvePaths;

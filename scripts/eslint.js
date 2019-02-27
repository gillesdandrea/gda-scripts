/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */

const fs = require('fs');
const glob = require('fast-glob');

const execute = require('../src/execute');
const resolveConfig = require('../src/resolveConfig');

const args = process.argv.slice(2);
const fix = args.findIndex(arg => arg === '--fix') >= 0;
const files = args.filter(arg => !arg.startsWith('-')); // TODO may mix files and option parameters

const paths = fs.existsSync('src')
  ? ['src']
  : fs.existsSync('packages')
  ? glob.sync(['packages/*/src'], { onlyDirectories: true })
  : [];
const targets = files.length > 0 ? files : paths;
if (targets.length === 0) {
  console.log('Usage: gda-scripts eslint <path>');
  return;
}

const config = resolveConfig('eslint').filepath;
// const cache = path.resolve(process.cwd(), './.eslintcache');
const parameters = [
  '--no-eslintrc',
  '--config',
  config,
  '--ext',
  '.js,.jsx,.ts,.tsx',
  fix && '--fix',
  '--color',
  '--report-unused-disable-directives',
  '--cache',
  // '--cache-location',
  // cache,
  // '--debug',
  ...targets,
].filter(Boolean);

const result = execute('eslint', parameters);
// process.exit(result.status);

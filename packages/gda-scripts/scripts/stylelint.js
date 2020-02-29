/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */

const fs = require('fs');
// const path = require('path');

const execute = require('../src/execute');
const resolveConfig = require('../src/resolveConfig');

const args = process.argv.slice(2);
const idx = args.findIndex(arg => arg.startsWith('-'));
const files = idx >= 0 ? args.slice(0, idx) : args;
const options = idx >= 0 ? args.slice(idx) : [];
// const fix = args.findIndex(arg => arg === '--fix') >= 0;

const exts = '*.{css,scss}';
const paths = fs.existsSync('src') ? 'src' : fs.existsSync('packages') ? 'packages/*/src' : null;
const targets =
  files.length > 0
    ? files.map(file =>
        file.includes('*.') || file.includes('.css') || file.includes('.scss') ? file : `${file}/**/${exts}`
      )
    : paths
    ? [`${paths}/**/${exts}`]
    : [];
if (targets.length === 0) {
  console.log('Usage: gda-scripts stylelint <paths>');
  return;
}

const config = resolveConfig('stylelint').filepath;
// const cache = path.join(process.cwd(), './.stylelintcache/');
const parameters = [
  ...targets,
  '--config',
  config,
  // '--syntax=scss', // not necessary as syntax is inferred by extension
  // fix && '--fix', // comes with options
  '--color',
  '--cache',
  // '--cache-location',
  // cache,
  ...options,
].filter(Boolean);

const result = execute('stylelint', parameters);
// process.exit(result.status);

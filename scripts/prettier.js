/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const execute = require('../src/execute');
const resolveConfig = require('../src/resolveConfig');

const args = process.argv.slice(2);
const others = args.filter(arg => arg.startsWith('-'));
const files = args.filter(arg => !arg.startsWith('-')); // TODO may mix files and option parameters

const exts = '*.{js,jsx,ts,tsx,css,scss,html,json,md}';

// eslint-disable-next-line no-nested-ternary
const paths = fs.existsSync('src')
  ? [`src/**/${exts}`]
  : fs.existsSync('packages')
  ? glob.sync([`packages/*/src/**/${exts}`], { onlyDirectories: true })
  : [];
if (paths.length === 0) {
  console.log('Usage: gda-scripts prettier <path>');
  return;
}
const targets = files.length > 0 ? files : paths;

const config = resolveConfig('prettier').filepath;
const ignore = path.join(config, '../.prettierignore');
const parameters = [
  '--config',
  config,
  '--ignore-path',
  ignore,
  // '--debug',
  ...others,
  ...targets,
].filter(Boolean);

const result = execute('prettier', parameters);
// process.exit(result.status);

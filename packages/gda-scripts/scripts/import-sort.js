/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */

const fs = require('fs');
// const path = require('path');
const glob = require('fast-glob');

const execute = require('../src/execute');
// const resolveConfig = require('../src/resolveConfig');

const args = process.argv.slice(2);
const others = args.filter(arg => arg.startsWith('-'));
const files = args.filter(arg => !arg.startsWith('-')); // TODO may mix files and option parameters

const exts = '*.{js,jsx,ts,tsx}';
const paths = fs.existsSync('src')
  ? [`src/**/${exts}`]
  : fs.existsSync('packages')
  ? glob.sync([`packages/*/src/**/${exts}`], { onlyFiles: false })
  : [];
if (paths.length === 0) {
  console.log('Usage: gda-scripts import-sort <path>');
  return;
}
const targets = files.length > 0 ? files : paths;

// TODO specify config is not yet supported
// const config = resolveConfig('importsort').filepath;
// const ignore = path.join(config, '../.importsortignore');
const parameters = [
  // '--config',
  // config,
  // '--ignore-path',
  // ignore,
  // '--debug',
  ...others,
  ...targets,
].filter(Boolean);

const result = execute('import-sort', parameters);
// process.exit(result.status);

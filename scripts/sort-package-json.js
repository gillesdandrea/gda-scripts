/* eslint-disable no-console */

const glob = require('fast-glob');

const execute = require('../src/execute');
const resolvePaths = require('../src/resolvePaths');

const args = process.argv.slice(2);
const others = args.filter(arg => arg.startsWith('-'));
const files = args.filter(arg => !arg.startsWith('-')); // TODO may mix files and option parameters

const targets = files.length > 0 ? files : resolvePaths('sort-package-json');

const parameters = [...others, ...glob.sync(targets)].filter(Boolean);

const result = execute('sort-package-json', parameters);
// process.exit(result.status);

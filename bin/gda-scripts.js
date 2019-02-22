#!/usr/bin/env node
// Inspired by https://github.com/facebook/create-react-app/tree/master/packages/react-scripts

/* eslint-disable no-console */

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs');
const path = require('path');

const execute = require('../src/execute');
const pkg = require('../package.json');

const script = process.argv[2] || '';
const scriptArgs = process.argv.slice(3);

if (fs.existsSync(path.join(__dirname, `../scripts/${script.replace(':', '.')}.js`))) {
  const result = execute('node', [require.resolve(`../scripts/${script}`)].concat(scriptArgs), undefined, false);
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.log(`${pkg.name}@${pkg.version}`);
  console.log(`Unknown script "${script}"`);
  console.log('Perhaps you need to update gda-scripts?');
}

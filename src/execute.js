/* eslint-disable no-console */

// const spawn = require('cross-spawn');
const spawn = require('react-dev-utils/crossSpawn');
const which = require('npm-which')(process.cwd());

function execute(name, parameters, env) {
  const exe = which.sync(name);
  if (exe) {
    console.log(`${name} ${parameters && parameters.length > 0 ? parameters.join(' ') : ''}`);
    return spawn.sync(
      exe,
      parameters,
      env
        ? {
            stdio: 'inherit',
            env: {
              ...process.env,
              ...env,
            },
          }
        : {
            stdio: 'inherit',
          }
    );
  }
  console.log(`Can't find ${name}`);
  return 0;
}

module.exports = execute;

/* eslint-disable no-console */
const chalk = require('chalk');
// const spawn = require('cross-spawn');
const spawn = require('react-dev-utils/crossSpawn');
// const which = require('npm-which')(process.cwd());
const which = require('npm-which')(__dirname);

function execute(name, parameters, env, log = true) {
  try {
    const exe = which.sync(name);
    if (log) {
      console.log(chalk.dim(`$ ${name} ${parameters && parameters.length > 0 ? parameters.join(' ') : ''}`));
    }
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
  } catch (e) {
    console.log(`Can't find ${name}`);
    return 0;
  }
}

module.exports = execute;

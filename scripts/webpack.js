const execute = require('../src/execute');

const args = process.argv.slice(2);
const mode = args.length ? `.${args[0]}` : '';
const config = `webpack.config${mode}.js`;
const watch = args.includes('-w') || args.includes('--watch') ? ['--watch'] : [];

const parameters = ['--config', config, '--progress', ...watch];
const result = execute('webpack', parameters);
// process.exit(result.status);

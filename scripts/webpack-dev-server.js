const execute = require('../src/execute');

const args = process.argv.slice(2);
const mode = args.length ? `.${args[0]}` : '';
const config = `webpack.config${mode}.js`;
const watch = args.includes('-w') || args.includes('--watch') ? ['--watch'] : [];
const open = args.includes('-o') || args.includes('--open') ? ['--open'] : [];

const parameters = ['--config', config, '--progress', ...open, ...watch];
const result = execute('webpack-dev-server', parameters);
// process.exit(result.status);

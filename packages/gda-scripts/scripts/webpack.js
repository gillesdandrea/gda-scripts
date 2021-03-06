const execute = require('../src/execute');

const args = process.argv.slice(2);
const mode = args.length ? `.${args[0]}` : '';
const config = `webpack.config${mode}.js`;
const watch = args.includes('-w') || args.includes('--watch') ? ['--watch'] : [];
const json = args.includes('--json');

const parameters = ['--config', config, json ? '--json' : '--progress', ...watch];
const result = execute('webpack', parameters);
// process.exit(result.status);

const path = require('path');

const execute = require('../src/execute');

const configDir = path.resolve(__dirname, '../config/storybook/html');

const args = process.argv.slice(2);
const port = args.includes('-p') || args.includes('--port') ? [] : ['-p', '9001'];
const config = args.includes('-c') || args.includes('--config-dir') ? [] : ['-c', configDir];

const parameters = [...port, ...config, ...args];
const result = execute('start-storybook', parameters);
// process.exit(result.status);

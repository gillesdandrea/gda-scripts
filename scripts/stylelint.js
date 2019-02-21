const execute = require('../src/execute');
const resolveConfig = require('../src/resolveConfig');

const args = process.argv.slice(2);
const idx = args.findIndex(arg => arg.startsWith('-'));
const files = idx >= 0 ? args.slice(0, idx) : args;
const options = idx >= 0 ? args.slice(idx) : [];

// const fix = args.findIndex(arg => arg === '--fix') >= 0;
const targets =
  files.length > 0
    ? files.map(file =>
        file.includes('*.') || file.includes('.css') || file.includes('.scss') ? file : `${file}/**/*.{css,scss}`
      )
    : ['src/**/*.{css,scss}'];

const config = resolveConfig('stylelint').filepath;
// const cache = path.resolve(process.cwd(), './.stylelintcache');
const parameters = [
  ...targets,
  '--config',
  config,
  '--syntax=scss',
  // fix && '--fix', // comes with options
  '--color',
  // '--cache',
  // '--cache-location',
  // cache,
  ...options,
].filter(Boolean);

const result = execute('stylelint', parameters);
// process.exit(result.status);

const fs = require('fs');
const path = require('path');

// TODO look into lerna.json too?
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json')));
const prefixes = pkg && pkg.workspaces ? `.,${pkg.workspaces.join(',')}` : '.';

module.exports = {
  'sort-package-json': [
    {
      files: 'package.json',
      paths: '.',
      prefixes,
    },
  ],
  prettier: [
    {
      files: '*.html,*.md,*.json,*.yaml,*.yml',
      paths: '.,config,doc',
      prefixes,
    },
    {
      files: '.*.json,.*.yaml,.*.yml,.*rc',
      paths: '.',
      prefixes,
    },
  ],
  'prettier-eslint': [
    {
      files: '*.js,*.jsx,*.ts,*.tsx,.*.js,.*.ts',
      paths: '.,src/**',
      prefixes,
    },
  ],
  'prettier-stylelint': [
    {
      files: '*.css,*.scss',
      paths: 'src/**',
      prefixes,
    },
  ],
};

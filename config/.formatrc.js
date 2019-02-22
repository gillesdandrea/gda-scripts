module.exports = {
  prettier: [
    {
      exts: '*.html,*.md,*.json,*.yaml,*.yml',
      paths: '.,config,doc',
      prefixes: '.,packages/*',
    },
    {
      exts: '.*.json,.*.yaml,.*.yml,.*rc',
      paths: '.',
      prefixes: '.,packages/*',
    },
  ],
  'prettier-eslint': [
    {
      exts: '*.js,*.jsx,*.ts,*.tsx,.*.js,.*.ts',
      paths: '.,src/**',
      prefixes: '.,packages/*',
    },
  ],
  'prettier-stylelint': [
    {
      exts: '*.css,*.scss',
      paths: 'src/**',
      prefixes: '.,packages/*',
    },
  ],
};

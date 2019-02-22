/* eslint-disable no-console */

const path = require('path');
const cosmiconfig = require('cosmiconfig');
const pkg = require('../package.json');

const allConfigs = ['babel', 'eslint', 'stylelint', 'importsort', 'prettier', 'browserslist', 'postcss'];
const configPath = path.join(__dirname, '../config');
const moduleName = process.argv[2];

async function displayConfigs() {
  console.log(`${pkg.name}@${pkg.version}`);
  try {
    const configs = moduleName ? [moduleName] : allConfigs;
    const results = await Promise.all(
      configs.map(async config => {
        const explorer = cosmiconfig(config);
        const result = (await explorer.search()) || (await explorer.search(configPath));
        const infos = result ? [result.filepath, '\n', result.config] : ['N/A'];
        return { config, infos };
      })
    );
    results.forEach(({ config, infos }) => console.log(`\n* ${config}:`, ...infos));
  } catch (e) {
    console.error(e);
  }
  console.log('\n');
}

displayConfigs();

const path = require('path');
const { cosmiconfigSync } = require('cosmiconfig');

const configPath = path.join(__dirname, '../config');

function resolveConfig(config) {
  // return path.resolve(__dirname, `../config/${name}`);
  const explorer = cosmiconfigSync(config);
  return explorer.search() || explorer.search(configPath);
}

module.exports = resolveConfig;

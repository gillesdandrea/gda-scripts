const path = require('path');
const cosmiconfig = require('cosmiconfig');

const configPath = path.join(__dirname, '../config');

function resolveConfig(config) {
  // return path.resolve(__dirname, `../config/${name}`);
  const explorer = cosmiconfig(config);
  return explorer.searchSync() || explorer.searchSync(configPath);
}

module.exports = resolveConfig;

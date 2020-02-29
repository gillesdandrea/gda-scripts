const fs = require('fs');
const path = require('path');

// approximative way to check if we are in monorepo configuration
function isMonorepo(dir) {
  try {
    return !!['package.json', '../../package.json'].find(file => {
      const pkg = JSON.parse(fs.readFileSync(path.resolve(dir, file), 'utf8'));
      return pkg.workspaces;
    });
  } catch (e) {
    // nothing to do
  }
  return false;
}

module.exports = isMonorepo;

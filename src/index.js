const { exec } = require('./tools/meta');
const { sleep } = require('./tools/sleep');
const { clean } = require('./tools/clean');
const { commitRefresh } = require('./tools/commit.refresh');
const {
  createCleanScriptFile,
  createPackageCheckSpecialVersionScriptFile,
  createInstallGlobalDevDependenceScriptFile,
  createDevelopFiles,
} = require('./tools/develop.file');
const { initialEnvironment } = require('./tools/initial.environment');
const {
  prettierAllPackageJson,
  prettierCurrentPackageJson,
} = require('./tools/prettier.package.json');
const {
  prettierAllFile,
  prettierChangeFile,
} = require('./tools/prettier.file');
const {
  installGlobalDevelopDependencePackages,
} = require('./tools/package.install.global.develop.dependence');
const { loopPackage } = require('./tools/package.tools');
const {
  checkAllPackageVersion,
  updateSpecialPackageVersion,
  updateAllPackageVersion,
} = require('./tools/package.update');
const {
  updatePackageFromPackage,
} = require('./tools/update.package.from.package');

module.exports = {
  clean,
  commitRefresh,
  initialEnvironment,
  installGlobalDevelopDependencePackages,
  loopPackage,
  checkAllPackageVersion,
  updateSpecialPackageVersion,
  updateAllPackageVersion,
  exec,
  sleep,
  createCleanScriptFile,
  createPackageCheckSpecialVersionScriptFile,
  createInstallGlobalDevDependenceScriptFile,
  createDevelopFiles,
  prettierAllFile,
  prettierChangeFile,
  prettierAllPackageJson,
  prettierCurrentPackageJson,
  updatePackageFromPackage,
};

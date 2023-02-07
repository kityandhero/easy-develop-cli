const { mkdirRelativeSync, checkStringIsEmpty, promptError, promptSuccess, writeJsonFileRelativeSync, writeFileSync, writeJsonFileSync, promptInfo, promptNewLine } = require('../tools/meta');
const { createDevelopScriptFiles } = require('../tools/develop.assist');
const { cd, exec } = require('../tools/shell');
const { getGlobalPackages, globalScript, packageScript } = require('../tools/package.script');

const { content: commitlintConfigContent } = require('../templates/commitlint.config.template');
const { content: babelConfigContent } = require('../templates/babel.config.template');
const { content: editorContent } = require('../templates/editor.template');
const { content: eslintContent, ignore: eslintIgnore, config: eslintConfig, rule: eslintRule } = require('../templates/eslint.template');
const { attribute: gitAttribute, ignore: gitIgnore } = require('../templates/git.template');
const { content: lintStagedContent } = require('../templates/lintStaged.template');
const { childPackage, mainPackage } = require('../templates/package.template');
const { ignore: prettierIgnore, content: prettierContent, config: prettierConfig } = require('../templates/prettier.template');
const { ignore: stylelintIgnore, content: stylelintContent, config: stylelintConfig } = require('../templates/stylelint.template');

function createLernaProjectFolder(name) {
  mkdirRelativeSync(name);

  promptSuccess(`step *: create folder ${name} success`);
}

function createLernaPackageJsonFile(lernaName) {
  const devDependencies = {};

  getGlobalPackages().forEach((o) => {
    if (checkStringIsEmpty(o)) {
      return;
    }

    devDependencies[o] = '^0.0.1';
  });

  const packageJson = {
    name: lernaName,
    version: '1.0.0',
    author: '',
    workspaces: ['packages/*'],
    scripts: globalScript,
    dependencies: {},
    devDependencies: devDependencies,
  };

  writeJsonFileRelativeSync(`./package.json`, packageJson);

  promptSuccess(`step *: create package.json success`);
}

function createPnpmWorkspaceFile() {
  const content = `packages:
  - 'packages/*'`;

  writeFileSync(`./pnpm-workspace.yaml`, content, { autoCreate: true });

  promptSuccess(`step *: create pnpm-workspace.yaml success`);
}

function createLernaConfigFile(lernaName) {
  const content = `{
    "packages": ["packages/*"],
    "version": "independent",
    "useWorkspaces": true,
    "npmClient": "pnpm",
    "command": {
      "updated": {
        "conventionalCommits": true,
        "changelogPreset": "conventional-changelog-conventionalcommits"
      },
      "version": {
        "conventionalCommits": true,
        "message": "chore(${lernaName}): version",
        "changelogPreset": "conventional-changelog-conventionalcommits"
      },
      "publish": {
        "conventionalCommits": true,
        "message": "chore(${lernaName}): publish",
        "changelogPreset": "conventional-changelog-conventionalcommits"
      }
    }
  }
  `;

  writeFileSync(`./lerna.json`, content, { autoCreate: true });

  promptSuccess(`step *: create lerna.json success`);
}

function createProjectFolder(name) {
  mkdirRelativeSync(`./packages/`);
  mkdirRelativeSync(`./packages/${name}`);
  mkdirRelativeSync(`./packages/${name}/src`);
}

function createPackageJsonFile(name) {
  const devDependencies = {};

  getGlobalPackages().forEach((o) => {
    if (checkStringIsEmpty(o)) {
      return;
    }

    devDependencies[o] = '^0.0.1';
  });

  const packageJson = {
    name: name,
    version: '1.0.0',
    author: '',
    scripts: packageScript,
    dependencies: {},
    devDependencies: devDependencies,
  };

  writeJsonFileRelativeSync(`./packages/${name}/package.json`, packageJson);

  promptSuccess(`step *: create package.json success`);
}

function createCommitlintConfigFile() {
  const content = commitlintConfigContent;

  writeFileSync(`./commitlint.config.js`, content, { autoCreate: true });

  promptSuccess(`step *: create commitlint.config.js success`);
}

function createBabelConfigFile() {
  const content = babelConfigContent;

  writeFileSync(`./babel.config.js`, content, { autoCreate: true });

  promptSuccess(`step *: create babel.config.js success`);
}

function createNcuConfigFile() {
  writeJsonFileSync(`./.ncurc.json`, {});

  promptSuccess(`step *: create .ncurc.json success`);
}

function createPackagesFolder() {
  mkdirRelativeSync(`./packages`);

  promptSuccess(`step *: create packages folder success`);
}

function createDevelopFolder() {
  mkdirRelativeSync(`./develop`);
  mkdirRelativeSync(`./develop/assists`);
  mkdirRelativeSync(`./develop/config`);

  mkdirRelativeSync(`./develop/config/editor/template`);
  writeFileSync(`./develop/config/editor/template/content.js`, editorContent, { autoCreate: true });

  //#region eslint

  mkdirRelativeSync(`./develop/config/eslint/template`);
  writeFileSync(`./develop/config/eslint/template/content.js`, eslintContent, { autoCreate: true });
  writeFileSync(`./develop/config/eslint/template/ignore.content.js`, eslintIgnore, { autoCreate: true });

  mkdirRelativeSync(`./develop/config/eslint/config`);
  writeFileSync(`./develop/config/eslint/config/index.js`, eslintConfig, { autoCreate: true });

  mkdirRelativeSync(`./develop/config/eslint/rules`);
  writeFileSync(`./develop/config/eslint/rules/index.js`, eslintRule, { autoCreate: true });

  //#endregion

  //#region git

  mkdirRelativeSync(`./develop/config/git/template`);
  writeFileSync(`./develop/config/git/template/attributes.content.js`, gitAttribute, { autoCreate: true });
  writeFileSync(`./develop/config/git/template/ignore.content.js`, gitIgnore, { autoCreate: true });

  //#endregion

  //#region lintStaged

  mkdirRelativeSync(`./develop/config/lintStaged/template`);
  writeFileSync(`./develop/config/lintStaged/template/content.js`, lintStagedContent, { autoCreate: true });

  //#endregion

  //#region package.json

  mkdirRelativeSync(`./develop/config/package/template`);
  writeFileSync(`./develop/config/package/template/children.content.js`, childPackage, { autoCreate: true });
  writeFileSync(`./develop/config/package/template/main.content.js`, mainPackage, { autoCreate: true });

  //#endregion

  //#region prettier

  mkdirRelativeSync(`./develop/config/prettier/template`);
  writeFileSync(`./develop/config/prettier/template/ignore.content.js`, prettierIgnore, { autoCreate: true });
  writeFileSync(`./develop/config/prettier/template/content.js`, prettierContent, { autoCreate: true });

  mkdirRelativeSync(`./develop/config/prettier/config`);
  writeFileSync(`./develop/config/prettier/config/index.js`, prettierConfig, { autoCreate: true });

  //#endregion

  //#region stylelint

  mkdirRelativeSync(`./develop/config/stylelint/template`);
  writeFileSync(`./develop/config/stylelint/template/ignore.content.js`, stylelintIgnore, { autoCreate: true });
  writeFileSync(`./develop/config/stylelint/template/content.js`, stylelintContent, { autoCreate: true });

  mkdirRelativeSync(`./develop/config/stylelint/config`);
  writeFileSync(`./develop/config/stylelint/config/index.js`, stylelintConfig, { autoCreate: true });

  //#endregion

  mkdirRelativeSync(`./develop/config/eslint/template`);

  promptSuccess(`step *: create develop folder success`);
}

function createHusky() {
  mkdirRelativeSync(`./.husky`);

  const commitMsg = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint -e $HUSKY_GIT_PARAMS -V
`;

  writeFileSync(`./.husky/commit-msg`, commitMsg, { autoCreate: true });

  const precommit = `#!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  npx lerna run --concurrency 1 --stream precommit --since HEAD --exclude-dependents
  `;

  writeFileSync(`./.husky/pre-commit`, precommit, { autoCreate: true });

  promptSuccess(`step *: create husky folder success`);
}

function createVscode() {
  mkdirRelativeSync(`./.vscode`);

  const settingJson = {
    'cSpell.words': ['conventionalcommits', 'packagejson', 'pmmmwh', 'postcz', 'postz', 'precommit', 'precz'],
    'git.ignoreLimitWarning': true,
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true,
      'source.fixAll.stylelint': true,
    },
  };

  writeJsonFileSync(`./.vscode/settings.json`, settingJson, { autoCreate: true });
}

function configEnvironment() {
  mkdirRelativeSync(`./develop`);

  promptSuccess(`step *: config environment`);

  promptNewLine();

  createDevelopScriptFiles(`.`);

  promptNewLine();

  promptInfo('add global dev packages');

  exec('npx ncu -u --packageFile ./package.json');

  promptInfo('install dependence packages');

  exec('pnpm install -w');

  promptNewLine();

  exec('npm run z:initial:environment');

  exec('git init -b main');

  exec('npx husky install');
}

function createLernaProject(name) {
  if (checkStringIsEmpty(name)) {
    promptError('project name disallow empty, please use create-lerna-project --name name or get info with create-lerna-project --help');

    return;
  }
  const lernaName = `lerna-${name}`;

  createLernaProjectFolder(lernaName);

  cd(`./${lernaName}`);

  createLernaPackageJsonFile(lernaName);
  createLernaConfigFile(lernaName);
  createPnpmWorkspaceFile();

  createProjectFolder(name);
  createPackageJsonFile(name);

  createCommitlintConfigFile();
  createBabelConfigFile();
  createNcuConfigFile();
  createPackagesFolder();
  createDevelopFolder();
  createHusky();
  createVscode();

  configEnvironment();
}

module.exports = { createLernaProject };

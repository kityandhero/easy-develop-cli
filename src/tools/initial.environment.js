const {
  promptSuccess,
  writeFileSync,
  assignObject,
  readJsonFileSync,
  writeJsonFileSync,
  resolvePath,
  promptEmptyLine,
} = require('./meta');
const { globalScript } = require('./package.script');

const { loopPackage } = require('./package.tools');
const { prettierAllPackageJson } = require('./prettier.package.json');

function createMainFile(fileWithContentCollection) {
  if (!Array.isArray(fileWithContentCollection)) {
    return;
  }

  fileWithContentCollection.forEach((o) => {
    const { name, content, coverFile } = o;

    writeFileSync(name, content, { coverFile });
  });

  const log = `main files [${fileWithContentCollection
    .map((o) => {
      const { name } = o;
      return name;
    })
    .join()}] refresh success`;

  promptSuccess(log);
  promptEmptyLine();
}

function createPackageFile(fileWithContentCollection) {
  loopPackage(({ absolutePath }) => {
    const itemPath = absolutePath;

    if (!Array.isArray(fileWithContentCollection)) {
      return;
    }

    fileWithContentCollection.forEach((o) => {
      const { name, content, coverFile } = o;

      writeFileSync(`${itemPath}/${name}`, content, { coverFile });
    });
  });

  const log = `package files [${fileWithContentCollection
    .map((o) => {
      const { name } = o;
      return name;
    })
    .join()}] refresh success`;

  promptSuccess(log);
  promptEmptyLine();
}

function adjustMainPackageJson({ scripts }) {
  const mainProjectPath = resolvePath(`./package.json`);

  const packageJson = readJsonFileSync(mainProjectPath);

  const originalScript = packageJson.scripts;

  Object.keys(originalScript).forEach((o) => {
    if (o.startsWith('z:') || o.startsWith('prez:') || o.startsWith('postz:')) {
      delete originalScript[o];
    }
  });

  packageJson.scripts = assignObject(
    {
      'z:build:all': 'echo please supplement build all packages commend',
      'z:publish:npm-all': 'echo please supplement publish to npm commend',
    },
    globalScript,
    originalScript || {},
    scripts,
  );

  writeJsonFileSync(mainProjectPath, packageJson, { coverFile: true });

  promptSuccess('adjust main package.json success');
  promptEmptyLine();
}

function adjustChildrenPackageJson({ scripts }) {
  loopPackage(({ name, absolutePath }) => {
    const itemPath = absolutePath;

    const childPackageJsonPath = `${itemPath}/package.json`;

    const packageJson = readJsonFileSync(childPackageJsonPath);

    const originalScript = packageJson.scripts;

    Object.keys(originalScript).forEach((o) => {
      if (
        o.startsWith('z:') ||
        o.startsWith('prez:') ||
        o.startsWith('postz:')
      ) {
        delete originalScript[o];
      }
    });

    packageJson.scripts = assignObject(originalScript || {}, scripts);

    writeJsonFileSync(childPackageJsonPath, packageJson, { coverFile: true });

    promptSuccess(`adjust ${name} package.json success`);
    promptEmptyLine();
  });
}

function initialEnvironment({
  mainFileContentList = [],
  packageFileContentList = [],
  mainScripts = {},
  childScripts = {},
}) {
  createMainFile(mainFileContentList || []);

  createPackageFile(packageFileContentList || []);

  adjustMainPackageJson({ scripts: mainScripts || {} });

  adjustChildrenPackageJson({ scripts: childScripts || {} });

  prettierAllPackageJson();
}

module.exports = { initialEnvironment };

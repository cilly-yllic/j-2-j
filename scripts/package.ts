const fs              = require('fs');
const packageJson     = JSON.parse( fs.readFileSync( `./package.json`) );

const dist = {
  name: packageJson.name,
  private: packageJson.private,
  version: packageJson.version,
  "bin": {
    "j-2-j": "./bin.js"
  },
  description: packageJson.description,
  main: packageJson.main,
  scripts: {
    postinstall: 'node ./install'
  },
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  repository: packageJson.repository,
  bugs: packageJson.bugs,
  homepage: packageJson.homepage,
  dependencies: packageJson.dependencies,
};

fs.writeFileSync( `./dist/package.json` , JSON.stringify( dist, null, '  ' ) );

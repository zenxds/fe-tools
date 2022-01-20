module.exports = {
  appId: 'com.dingxiang.app',
  productName: '前端工具箱',
  directories: {
    output: 'release',
  },
  publish: [
    {
      provider: 'generic',
      url: 'https://fe.dingxiang-inc.com/download/fe-tools',
    }
  ],
  files: [
    '**/*',
    '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
    '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
    '!**/node_modules/*.d.ts',
    '!**/node_modules/.bin',
    '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}',
    '!.editorconfig',
    '!**/._*',
    '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
    '!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}',
    '!**/{appveyor.yml,.travis.yml,circle.yml}',
    '!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}',

    '!src',
    '!test',
    '!config',
  ],
  mac: {
    icon: './icons/mac/icon.icns',
  },
  win: {
    icon: './icons/win/icon.ico',
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    installerIcon: './icons/win/icon.ico',
    uninstallerIcon: './icons/win/icon.ico',
  },
}

const path = require('path');
const tester = require('babel-plugin-tester');

// No options
tester({
  plugin: require('../src/index'),
  pluginName: 'chronstruct-primitives',
  fixtures: path.join(__dirname, '..', '__fixtures__', 'no-options'),
});

// Option: autoImport = true
tester({
  plugin: require('../src/index'),
  pluginName: 'chronstruct-primitives',
  pluginOptions: {
    autoImport: true,
  },
  fixtures: path.join(__dirname, '..', '__fixtures__', 'auto-import'),
});
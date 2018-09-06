const path = require('path');
const tester = require('babel-plugin-tester');

tester({
  plugin: require('../src/index'),
  pluginName: 'chronstruct-primitives',
  fixtures: path.join(__dirname, '..', '__fixtures__'),
});
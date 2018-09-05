const path = require('path');
const tester = require('babel-plugin-tester');

tester({
  plugin: require('../src/index'),
  pluginName: 'chronstruct-primitives',
//   babelOptions: {
//     babelrc: true,
//   },
  fixtures: path.join(__dirname, '..', '__fixtures__'),
});
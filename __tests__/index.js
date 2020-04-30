const path = require("path")
const tester = require("babel-plugin-tester").default

// No options
tester({
  plugin: require("../src/index"),
  pluginName: "chronstruct-primitives",
  // babelOptions: {
  //   babelrc: true,
  // },
  fixtures: path.join(__dirname, "..", "__fixtures__", "no-options"),
})

// Option: autoImport = true
tester({
  plugin: require("../src/index"),
  pluginName: "chronstruct-primitives",
  pluginOptions: {
    autoImport: true,
  },
  fixtures: path.join(__dirname, "..", "__fixtures__", "auto-import"),
})

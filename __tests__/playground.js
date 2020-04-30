const babel = require("babel-core")
const plugin = require("../src/")

const options = { plugins: ["syntax-jsx", plugin] }

it("A test suite must contain at least one test", () => {
  expect(true).toBe(true)
})

// it("object config with variable keys", () => {
//   var input = `<space shrink={{'': true, [someVar]: 2}} />`
//   const { code } = babel.transform(input, options)

//   expect(code).toBe(
//     `<div className={css\`\n  flex-grow: 0;\n  flex-shrink: 1;\n\n  \${someVar} {\n    flex-shrink: 2;\n  }\n\`} />;`
//   )
// })

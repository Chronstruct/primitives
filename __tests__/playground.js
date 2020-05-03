const babel = require("babel-core")
const plugin = require("../src/")

const options = { plugins: ["syntax-jsx", plugin] }

it("A test suite must contain at least one test", () => {
  expect(true).toBe(true)
})

it("playground", () => {
  var input = `<space shrink={{_: true, someVar: 2, [otherVar]: 3}} />`
  // var input = `<space shrink={{someVar: 2, [otherVar]: 3}} />`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div className={css\`\n  flex-grow: 0;\n  flex-shrink: 1;\n\n  someVar {\n    flex-shrink: 2;\n  }\n\n  \${otherVar} {\n    flex-shrink: 3;\n  }\n\`} />;`
  )
})

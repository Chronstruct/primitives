const babel = require("babel-core")
const plugin = require("../src/")

const options = { plugins: ["syntax-jsx", plugin] }

it("A test suite must contain at least one test", () => {
  expect(true).toBe(true)
})

// it("playground", () => {
//   // var input = `<space shrink={\`\${someVar ? true : false}\`}/>`
//   // var input = `<space shrink={someVar ? true : false}/>`
//   // var input = `<space shrink={someVar && true}/>`

//   const { code } = babel.transform(input, options)

//   expect(code).toBe(``)
// })

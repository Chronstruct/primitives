const babel = require("babel-core")
const plugin = require("../src/")

const options = { plugins: ["syntax-jsx", plugin] }

it("A test suite must contain at least one test", () => {
  expect(true).toBe(true)
})

// it("playground", () => {
//   // var input = `<space shrink={\`\${someVar ? true : false}\`}/>`
//   // var input = `<space shrink={someVar ? true : false}/>`
//   // var input = `<text className={css\`background: red;\`}/>`
//   // var input = `<text className={someVar}/>`
//   // var input = `<text className={"someString"}/>`
//   // var input = `<box grow={SOME_CONST && true}/>`
//   // var input = `<box grow={SOME_CONST && someVar}/>`

//   var input = `<box grow={SOME_VAR ? someVar : 1}/>`

//   const { code } = babel.transform(input, options)

//   expect(code).toBe(``)
// })

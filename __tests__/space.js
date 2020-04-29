// src/__tests__/index-test.js
const babel = require("@babel/core")
const plugin = require("../src/")

const options = { plugins: ["syntax-jsx", plugin] }

const defaultCss = `flexGrow: 0,\n  flexShrink: 0`

it("default space", () => {
  const input = `<space />`

  const { code } = babel.transform(input, options)

  expect(code).toBe(`<div className={css({\n  ${defaultCss}\n})} />;`)
})

it("size string", () => {
  var input = `<space size='10px'/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div className={css({\n  ${defaultCss},\n  flexBasis: '10px'\n})} />;`
  )
})

it("size expression string", () => {
  var input = `<space size={'10px'}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div className={css({\n  ${defaultCss},\n  flexBasis: '10px'\n})} />;`
  )
})

it("size expression identifier", () => {
  var input = `<space size={someVar}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div className={css({\n  ${defaultCss},\n  flexBasis: someVar\n})} />;`
  )
})

it("size expression templateLiteral", () => {
  var input = `<space size={\`\${someVar}px\`}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div className={css({\n  ${defaultCss},\n  flexBasis: \`\${someVar}px\`\n})} />;`
  )
})

it("size expression conditionalExpression", () => {
  var input = `<space size={\`\${someVar ? true : false}\`}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div className={css({\n  ${defaultCss},\n  flexBasis: \`\${someVar ? true : false}\`\n})} />;`
  )
})

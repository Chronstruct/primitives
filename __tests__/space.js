// src/__tests__/index-test.js
const babel = require("@babel/core")
const plugin = require("../src/")

const options = { plugins: ["syntax-jsx", plugin] }

const start = "className={css`\n  "
const end = "\n`}"
const defaultCss = `flex-grow: 0;\n  flex-shrink: 0;`

it("default space", () => {
  const input = `<space />`

  const { code } = babel.transform(input, options)

  expect(code).toBe(`<div ${start}${defaultCss}${end} />;`)
})

it("size string", () => {
  var input = `<space size='10px'/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(`<div ${start}${defaultCss}\n  flex-basis: 10px;${end} />;`)
})

it("size expression string", () => {
  var input = `<space size={'10px'}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(`<div ${start}${defaultCss}\n  flex-basis: 10px;${end} />;`)
})

it("size expression identifier", () => {
  var input = `<space size={someVar}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div ${start}${defaultCss}\n  flex-basis: \${someVar};${end} />;`
  )
})

it("size expression templateLiteral", () => {
  var input = `<space size={\`\${someVar}px\`}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div ${start}${defaultCss}\n  flex-basis: \`\${someVar}px\`;${end} />;`
  )
})

it("size expression conditionalExpression", () => {
  var input = `<space size={\`\${someVar ? true : false}\`}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div ${start}${defaultCss}\n  flex-basis: \`\${someVar ? true : false}\`;${end} />;`
  )
})

it("size object", () => {
  var input = `<space size={{'': 10, '@media screen and (min-width: 200px)': 200}}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div ${start}${defaultCss}\n  flex-basis: 10px;\n\n  @media screen and (min-width: 200px) {\n    flex-basis: 200px;\n  }${end} />;`
  )
})

it("grow object", () => {
  var input = `<space grow={{'': false, '@media screen and (min-width: 200px)': true}}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div ${start}flex-grow: 0;\n  flex-shrink: 0;\n\n  @media screen and (min-width: 200px) {\n    flex-grow: 1;\n  }${end} />;`
  )
})

it("shrink", () => {
  var input = `<space shrink={true}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(`<div ${start}flex-grow: 0;\n  flex-shrink: 1;${end} />;`)
})

it("shrink object", () => {
  var input = `<space shrink={{'': false, '@media screen and (min-width: 200px)': true}}/>`

  const { code } = babel.transform(input, options)

  expect(code).toBe(
    `<div ${start}flex-grow: 0;\n  flex-shrink: 0;\n\n  @media screen and (min-width: 200px) {\n    flex-shrink: 1;\n  }${end} />;`
  )
})

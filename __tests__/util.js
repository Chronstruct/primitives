var t = require("@babel/types")
var Utils = require("../src/utils")
var renameTag = Utils.renameTag,
  addBooleanPropertySet = Utils.addBooleanPropertySet,
  addBooleanProperty = Utils.addBooleanProperty,
  addCssProperty = Utils.addCssProperty,
  buildClassNamePropFunction = Utils.buildClassNamePropFunction

//TODO: test renameTag()

it("addCssProperty with NumericLiteral", () => {
  var input = {}
  var key = "flexShrink"
  var value = t.numericLiteral(1)

  var expectedOutput = { [key]: value }

  addCssProperty(input, key, value)

  expect(input).toStrictEqual(expectedOutput)
})

it("addCssProperty with ObjectExpression", () => {
  // size={{'': 20, '@media screen and (min-width: 200px)': 200}}
  var input = {}
  var key = "size"
  var value = t.jsxExpressionContainer(
    t.objectExpression([
      t.objectProperty(t.stringLiteral(""), t.numericLiteral(20)),
      t.objectProperty(
        t.stringLiteral("@media screen and (min-width: 200px)"),
        t.numericLiteral(200)
      ),
    ])
  )

  /*
   {
     '@media screen and (min-width: 200px)': {
       size: 200
     },
     size: 20,
    }
   */
  var expectedOutput = {
    [key]: t.numericLiteral(20),
    "@media screen and (min-width: 200px)": t.objectExpression([
      t.objectProperty(t.identifier(key), t.numericLiteral(200)),
    ]),
  }

  addCssProperty(input, key, value)

  expect(input).toStrictEqual(expectedOutput)
})

//-- addObjectValueToCSS()

it("addObjectValueToCSS handles var keys", () => {
  // {'': 20, someVar: 200}
  var input = {}
  var key = "someKey"
  var value = t.objectExpression([
    t.objectProperty(t.stringLiteral(""), t.numericLiteral(20)),
    t.objectProperty(t.identifier("_dynamic"), t.numericLiteral(200)),
  ])

  /*
   {
     size: 20,
     '@media screen and (min-width: 200px)': {
       size: 200
     },
    }
   */
  var expectedOutput = {
    [key]: t.numericLiteral(20),
    _dynamic: t.objectExpression([
      t.objectProperty(t.identifier(key), t.numericLiteral(200)),
    ]),
  }

  addCssProperty(input, key, value)

  expect(input).toStrictEqual(expectedOutput)
})

it("addObjectValueToCSS handles computed var keys", () => {
  // {'': 20, [someVar]: 200}
  var input = {}
  var key = "someKey"
  var value = t.objectExpression([
    t.objectProperty(t.stringLiteral(""), t.numericLiteral(20)),
    t.objectProperty(t.identifier("someVar"), t.numericLiteral(200), true),
  ])

  /*
   {
     size: 20,
     '@media screen and (min-width: 200px)': {
       size: 200
     },
    }
   */
  var expectedOutput = {
    [key]: t.numericLiteral(20),
    "${someVar}": t.objectExpression([
      t.objectProperty(t.identifier(key), t.numericLiteral(200)),
    ]),
  }

  addCssProperty(input, key, value)

  expect(input).toStrictEqual(expectedOutput)
})

//-- addBooleanPropertySet()

it("addBooleanPropertySet `center={true}`", () => {
  var input = {}
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("center"),
    t.jsxExpressionContainer(t.booleanLiteral(true))
  )
  var propertiesToAdd = { someKey: t.numericLiteral(1) }

  addBooleanPropertySet(input, attribute, propertiesToAdd)

  expect(input).toStrictEqual(propertiesToAdd)
})

it("addBooleanPropertySet `center`", () => {
  var input = {}
  var attribute = t.jsxAttribute(t.jsxIdentifier("center"))
  var propertiesToAdd = { someKey: t.numericLiteral(1) }

  addBooleanPropertySet(input, attribute, propertiesToAdd)

  expect(input).toStrictEqual(propertiesToAdd)
})

// TODO - implement

// it("addBooleanPropertySet `center={Object}`", () => {
//   var input = {}
//   var attribute = t.jsxAttribute(
//     t.jsxIdentifier("center"),
//     t.objectExpression([t.objectProperty(t.identifier("hover"))])
//   )
//   var propertiesToAdd = { someKey: t.numericLiteral(1) }

//   /*
//    {
//      '@media screen and (min-width: 200px)': {
//        size: 200
//      },
//      size: 20,
//     }
//    */
//   var expectedOutput = {
//     "hover": t.objectExpression([
//       t.objectProperty(t.identifier("size"), t.numericLiteral(200)),
//     ]),
//     size: t.numericLiteral(20),
//   }

//   addBooleanPropertySet(input, attribute, propertiesToAdd)

//   expect(input).toStrictEqual(propertiesToAdd)
// })

//-- addBooleanProperty()

it("addBooleanProperty `grow`", () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var attribute = t.jsxAttribute(t.jsxIdentifier("grow"))

  var expectedOutput = { [key]: valueMap[true] }

  addBooleanProperty(input, {}, attribute, key, valueMap)

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow="string" does nothing by default`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var value = t.stringLiteral("1")
  var attribute = t.jsxAttribute(t.jsxIdentifier("grow"), value)

  var expectedOutput = {}

  addBooleanProperty(input, {}, attribute, key, valueMap)

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow="string" does something when enabled`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var value = t.stringLiteral("1")
  var attribute = t.jsxAttribute(t.jsxIdentifier("grow"), value)

  var expectedOutput = { [key]: value }

  addBooleanProperty(input, {}, attribute, key, valueMap, { allowString: true })

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow={"string"} does nothing by default`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var value = t.stringLiteral("string")
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("grow"),
    t.jsxExpressionContainer(value)
  )

  var expectedOutput = {}

  addBooleanProperty(input, {}, attribute, key, valueMap)

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow={"string"} does something when enabled`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var value = t.stringLiteral("string")
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("grow"),
    t.jsxExpressionContainer(value)
  )

  var expectedOutput = { [key]: value }

  addBooleanProperty(input, {}, attribute, key, valueMap, { allowString: true })

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow={1} does nothing by default`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var value = t.numericLiteral(1)
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("grow"),
    t.jsxExpressionContainer(value)
  )

  var expectedOutput = {}

  addBooleanProperty(input, {}, attribute, key, valueMap)

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow={1} does something when enabled`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var value = t.numericLiteral(1)
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("grow"),
    t.jsxExpressionContainer(value)
  )

  var expectedOutput = { [key]: value }

  addBooleanProperty(input, {}, attribute, key, valueMap, { allowNumber: true })

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow={true}`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("grow"),
    t.jsxExpressionContainer(t.booleanLiteral(true))
  )

  var expectedOutput = { [key]: valueMap[true] }

  addBooleanProperty(input, {}, attribute, key, valueMap)

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow={{'': true, 'hover': false}}`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("grow"),
    t.jsxExpressionContainer(
      t.objectExpression([
        t.objectProperty(t.stringLiteral(""), t.booleanLiteral(true)),
        t.objectProperty(t.stringLiteral("hover"), t.booleanLiteral(false)),
      ])
    )
  )

  var expectedOutput = {
    [key]: t.numericLiteral(1),
    hover: t.objectExpression([
      t.objectProperty(t.identifier(key), t.numericLiteral(0)),
    ]),
  }
  addBooleanProperty(input, {}, attribute, key, valueMap)

  expect(input).toStrictEqual(expectedOutput)
})

it(`addBooleanProperty grow={{'': 1, 'hover': false}}`, () => {
  var input = {}
  var key = "flexGrow"
  var valueMap = { true: t.numericLiteral(1), false: t.numericLiteral(0) }
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("grow"),
    t.jsxExpressionContainer(
      t.objectExpression([
        t.objectProperty(t.stringLiteral(""), t.numericLiteral(1)),
        t.objectProperty(t.stringLiteral("hover"), t.booleanLiteral(false)),
      ])
    )
  )

  var expectedOutput = {
    [key]: t.numericLiteral(1),
    hover: t.objectExpression([
      t.objectProperty(t.identifier(key), t.numericLiteral(0)),
    ]),
  }
  addBooleanProperty(input, {}, attribute, key, valueMap, { allowNumber: true })

  expect(input).toStrictEqual(expectedOutput)
})

"use strict"

// var printAST = require('ast-pretty-print')
var convertFlex = require("./flex")
var convertSpace = require("./space")
var convertText = require("./text")
var convertGeneric = require("./generic")

module.exports = function (babel) {
  var { types: t } = babel

  return {
    // ---
    // below equates to `inherits: @babel/plugin-syntax-jsx;`
    // https://github.com/babel/babel/blob/master/packages/babel-plugin-syntax-jsx/src/index.js#L9
    //
    manipulateOptions(opts, parserOpts) {
      // If the Typescript plugin already ran, it will have decided whether
      // or not this is a TSX file.
      if (
        parserOpts.plugins.some(
          (p) => (Array.isArray(p) ? p[0] : p) === "typescript"
        )
      ) {
        return
      }

      parserOpts.plugins.push("jsx")
    },
    // ---
    visitor: {
      Program: {
        enter(path, state) {
          // option set, has not been added, and does not already exist
          if (
            !state.opts.autoImport ||
            state.hasAddedImport ||
            path.scope.hasBinding("css")
          ) {
            return
          }

          // add import
          const identifier = t.identifier("css")
          const importSpecifier = t.importSpecifier(identifier, identifier)
          const importDeclaration = t.importDeclaration(
            [importSpecifier],
            t.stringLiteral("linaria")
          )

          // (hopefully) temporary workaround to get Linaria to do its thing
          //- css``
          path.node.body.unshift(
            t.taggedTemplateExpression(
              identifier,
              t.templateLiteral(
                [
                  t.templateElement({
                    raw: "",
                    cooked: "",
                  }),
                ],
                []
              )
            )
          )

          // Add the linaria import to the top of the file
          path.node.body.unshift(importDeclaration)
          state.hasAddedImport = true
        },
      },
      JSXElement(path, state) {
        var element =
          path.node && path.node.openingElement && path.node.openingElement.name

        if (!element) {
          return
        }

        switch (element.name) {
          case "view":
          case "col":
          case "column":
          case "row":
          case "flex":
          case "box":
          case "BOX":
          case "v":
          case "h":
          case "stack":
            convertFlex(path.node, element.name)
            break
          case "space":
          case "SPACE":
            convertSpace(path.node)
            break
          case "text":
          case "txt":
          case "TEXT":
            convertText(path.node)
            break
          // ONLY used in tests!!!
          case "generic":
            convertGeneric(path.node)
            break
        }
      },
    },
  }
}

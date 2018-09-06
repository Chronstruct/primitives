'use strict';

// var printAST = require('ast-pretty-print')
var convertFlex = require('./flex')
var convertSpace = require('./space')
var convertText = require('./text')

module.exports = function(babel) {
  var { types: t } = babel;

  return {
    inherits: require("babel-plugin-syntax-jsx"),
    visitor: {
      Program: {
        enter(path, state) {
          // has not been added, and does not already exist
          if (state.hasAddedImport || path.scope.hasBinding('css')) {
            return
          }
          
          const identifier = t.identifier('css');
          const importSpecifier = t.importSpecifier(identifier, identifier);
          const importDeclaration = t.importDeclaration([importSpecifier], t.stringLiteral('linaria'));
          path.node.body.unshift(importDeclaration);
          state.hasAddedImport = true
        },
      },
      JSXElement(path, state) {
        var element = path.node && path.node.openingElement && path.node.openingElement.name

        if (!element) {
          return
        }

        switch (element.name) {
          case 'view':
          case 'col':
          case 'row':
          case 'flex':
          case 'box':
            convertFlex(path.node, element.name)
            break
          case 'space':
            convertSpace(path.node)
            break
          case 'text':
            convertText(path.node)
            break
        }
      }, 
    }
  }
}

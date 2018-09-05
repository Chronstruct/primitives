'use strict';

// var printAST = require('ast-pretty-print')
var convertFlex = require('./flex')
var convertSpace = require('./space')
var convertText = require('./text')

module.exports = function(babel) {
  var { types: t } = babel;

  return {
    name: "ast-transform", // not required
    inherits: require("babel-plugin-syntax-jsx"),
    visitor: {
      JSXElement(path) {
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
      }
    }
  };
}

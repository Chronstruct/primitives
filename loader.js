const plugin = require("./src/index.js")
// const babelPresetTypescript = require("@babel/preset-typescript")

const isTsFile = /\.(ts)x?$/

module.exports = require("babel-loader").custom((babel) => {
  let shouldImport = false

  return {
    // Passed the loader options.
    customOptions({ autoImport, ...loader }) {
      shouldImport = autoImport || false

      return {
        // Pull out any custom options that the loader might have.
        custom: { autoImport },

        // Pass the options back with the two custom options removed.
        loader,
      }
    },

    // Passed Babel's 'PartialConfig' object.
    config(cfg) {
      if (cfg.hasFilesystemConfig()) {
        // Use the normal config
        return cfg.options
      }

      const isTS = isTsFile.test(cfg.options.filename)

      return {
        ...cfg.options,
        plugins: [
          ...(cfg.options.plugins || []),
          [
            plugin,
            {
              autoImport: shouldImport,
            },
          ],
        ],
        presets: [
          ...(cfg.options.presets || []),
          isTS && "@babel/preset-typescript",
          // isTS && babelPresetTypescript,
        ].filter(Boolean),
      }
    },
  }
})

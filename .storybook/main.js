/**
 * Equivalent of webpack.config.js for storybook
 */
const path = require("path")

// Export a function. Accept the base config as the only param.
module.exports = {
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          // Third: transform through babel as normal
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        {
          // Second: extract css from css`` templates
          loader: "linaria/loader",
          options: {
            sourceMap: process.env.NODE_ENV !== "production",
            babelOptions: {
              plugins: ["@babel/plugin-syntax-jsx"],
            },
          },
        },
        {
          // First: transform to css`` templates
          loader: "babel-loader",
          options: {
            plugins: [path.join(__dirname, "..", "src/index.js")],
          },
        },
      ],
    })

    // Return the altered config
    return config
  },
}

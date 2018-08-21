const pkg = require("./package.json");
const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const path = require("path");
const theme = pkg.theme;

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
  require.extensions['.css'] = (file) => {}
}

// antd + nextjs
// https://github.com/zeit/next.js/tree/canary/examples/with-ant-design
module.exports = withCss(withLess({
  lessLoaderOptions: {
    modifyVars: theme,
    javascriptEnabled: true
  },
  webpack: (config, {}) => {
    const internalNodeModulesRegExp = /@zeit(?!.*node_modules)|\.schema\.js$|canner\.def\.js$/

    // overwrite external paths
    // https://github.com/zeit/next.js/pull/3732/files#diff-0b0406776536850213e57e76340d2a2dR10
    config.externals = config.externals.map(external => {
      if (typeof external !== "function") return external
        return (ctx, req, cb) => (internalNodeModulesRegExp.test(req) ? cb() : external(ctx, req, cb))
    })

    config.resolve.alias["styled-components"] = path.resolve(__dirname, 'node_modules', 'styled-components');

    // with antd example using next.js
    // https://github.com/zeit/next.js/tree/canary/examples/with-ant-design
    config.module.rules.push(
      // loader for canner.schema.js
      {
        test: /\.schema\.js|canner\.def\.js$/,
        // include by files and folders who match the pattern.
        include: [
          path.join(__dirname, 'schema'),
          path.join(__dirname, 'node_modules')
        ],
        use: [
          {loader: 'canner-schema-loader'},
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ["next/babel", {
                  "preset-env": {modules: 'commonjs'},
                  "transform-runtime": {
                    helpers: true,
                    regenerator: true
                  }
                }]
              ],
              plugins: [
                "transform-flow-strip-types"
              ]
            }
          }
        ]
      }
    );
    return config;
  }
}))




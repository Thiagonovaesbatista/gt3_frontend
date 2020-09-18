const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const { DefinePlugin } = require('webpack');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb({
      eslint: {
        baseConfig: {
          rules: {
            "import/no-extraneous-dependencies": ["error", { "devDependencies": [".eslintrc.js", "webpack.config.js"] }],
            "jsx-a11y/label-has-associated-control": [ 2, {
              "controlComponents": ["InputText", "InputTextarea"],
              "depth": 5
            }],
          }
        }
      }
    }),
    react({
      html: {
        title: 'Gestão de terceiros'
      },
      style: {
        test: /\.(css|sass|scss)$/,
        moduleTest: /\.module\.(css|sass|scss)$/,
        loaders: [
          'sass-loader'
        ]
      }
    }),
    (neutrino) => {
      neutrino.config.plugin('env').use(DefinePlugin, [
        { "process.env": 
          { "API_URL": "https://704be563-6fd5-42b8-b183-e74d58510105.mock.pstmn.io" } 
        }
      ])
    }
  ],
};

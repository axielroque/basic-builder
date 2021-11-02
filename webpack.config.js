const path = require('path');

// include the js minification plugin
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// include the css extraction and minification plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = ["home", "thank-you"];
const NewHtmlWebpackPlugin = pages.map(
  (page) =>
    new HtmlWebpackPlugin({
      inject: 'body',
      template: `./pages/${page}.html`,
      filename: `./templates/${page}.html`
    })
);

module.exports = {
  entry: ['./src/js/index.js', './src/scss/index.scss'],
  output: {
    filename: './build/js/app.min.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      // perform js babelization on all .js files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['babel-preset-env']
          }
        }
      },
      // compile all .scss files to plain old css
      {
        test: /\.(sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    // extract css into dedicated file
    new MiniCssExtractPlugin({
      filename: './build/css/main.min.css'
    }),
    // clean out build directories on each build
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['./build/js/*', './build/css/*']
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './pages/index.html',
      filename: 'index.html',
    })
  ].concat(NewHtmlWebpackPlugin),
  optimization: {
    minimizer: [
      // enable the js minification plugin
      new UglifyJSPlugin({
        cache: true,
        parallel: true
      }),
      // enable the css minification plugin
      new OptimizeCSSAssetsPlugin({})
    ]
  }
};
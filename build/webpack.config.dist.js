const path = require('path');
const { DefinePlugin, optimize: { UglifyJsPlugin } } = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  entry: {
    index: './docs/src/index',
  },

  resolve: {
    modules: [path.resolve(__dirname, 'docs/src'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },

  output: {
    filename: '[name]-[hash:5].js',
    path: path.resolve('docs/dist'),
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50000,
            }
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: false,
                localIdentName: '[name]-[local]-[hash:5]',
                safe: true,
                autoprefixer: {
                  add: true,
                  // browser: [],
                },
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        })
      },
    ],
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new AssetsPlugin({
      processOutput: assets => JSON.stringify(assets).replace(new RegExp('docs/dist', 'ig'), ''),
    }),
    new UglifyJsPlugin({
      mangle: {
        screw_ie8: true,
      },
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin('[name]-[hash:5].css'),
  ],
};

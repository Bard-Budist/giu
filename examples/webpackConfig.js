const path = require('path');
const webpack = require('webpack');
const fProduction = process.env.NODE_ENV === 'production';

const _entry = (entry) => [
  // 'webpack-hot-middleware/client?reload=true',
  entry,
];

module.exports = {

  // -------------------------------------------------
  // Input (entry point)
  // -------------------------------------------------
  entry: {
    examples: _entry('./examples/examples.js'),
  },

  // -------------------------------------------------
  // Output
  // -------------------------------------------------
  output: {
    filename: '[name].bundle.js',

    // Where PRODUCTION bundles will be stored
    path: path.resolve(process.cwd(), 'examples/public'),

    publicPath: '/public/',
  },

  // -------------------------------------------------
  // Configuration
  // -------------------------------------------------
  devtool: fProduction ? undefined : 'eval',

  resolve: {
    // Add automatically the following extensions to required modules
    extensions: ['', '.jsx', '.js'],
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(fProduction ? 'production' : 'development'),
    }),
  ],

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel',
      exclude: path.resolve(process.cwd(), 'node_modules'),
    }, {
      test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file',
    }, {
      test: /\.css$/,
      loader: 'style!css',
    }],
  },
};

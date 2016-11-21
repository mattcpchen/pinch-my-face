const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');



var config = {
  devtool: 'eval-source-map',
  entry:  __dirname + "/client/app.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015','stage-2']
      }
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap'),
      include: __dirname + "/client"
    }, {
      test: /\.jpg$/,
      loader: "file-loader"
    }]
  },
  devServer: {
    contentBase: "./public",
    colors: true,
    historyApiFallback: true,
    inline: true
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
    new ProgressBarPlugin({ clear: false })
  ]
}


// If bundling for production, optimize output


if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dev-for-server') {
  config.devtool = false;
  config.plugins = config.plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({comments: false}),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    })
  ]);
};

module.exports = config;

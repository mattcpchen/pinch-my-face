import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';


const sharedProdPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({comments: false})
];



const config_server = {
  entry:  __dirname + "/server/index.js",
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  output: {
    path: __dirname + "/dist",
    filename: "server.js",
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
      test: /\.json$/,
      loader: 'json'
    }]
  },
  plugins: [
    new ProgressBarPlugin({ clear: false })
  ]
};



config_server.plugins = config_server.plugins.concat(sharedProdPlugins);



module.exports = config_server;

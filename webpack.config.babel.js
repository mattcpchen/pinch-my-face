import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';



const config_client = {
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
    },{
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
};

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



let config = config_client;
if (process.env.NODE_ENV === 'production') {
  const sharedPlugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({comments: false}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        PORT: JSON.stringify(process.env.PORT)
      }
    })
  ];
  
  config_client.devtool = false;
  config_client.plugins = config_client.plugins.concat(sharedPlugins);
  config_server.plugins = config_server.plugins.concat(sharedPlugins);
  
  config = [config_client, config_server];
};


module.exports = config;

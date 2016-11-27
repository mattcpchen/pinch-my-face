import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';



const sharedProdPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({comments: false})
];



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




if (process.env.NODE_ENV === 'production') {
  config_client.devtool = false;
  config_client.plugins = config_client.plugins.concat(sharedProdPlugins);
};
  



module.exports = config_client;

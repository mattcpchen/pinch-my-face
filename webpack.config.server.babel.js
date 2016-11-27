import ProgressBarPlugin from 'progress-bar-webpack-plugin';



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



const generateConfig = (sharedProdPlugins) => {
  if (process.env.NODE_ENV === 'production') {
    config_server.plugins = config_server.plugins.concat(sharedProdPlugins);
  }
  
  return config_server;
};



module.exports = generateConfig;

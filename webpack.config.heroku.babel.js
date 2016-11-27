const config_heroku = {
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
  plugins: []
};




const generateConfig = (sharedProdPlugins) => {
  config_heroku.plugins = config_heroku.plugins.concat(sharedProdPlugins);
  
  return config_heroku;
};



module.exports = generateConfig;

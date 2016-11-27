import webpack from 'webpack';


const sharedProdPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({comments: false}),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.EnvironmentPlugin(['PORT'])
];


let config;


// cient only
if (process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'prodForHeroku') {
  const config_client = require('./webpack.config.client.babel.js')(sharedProdPlugins);
  config = config_client;
}



// client + server
if(process.env.NODE_ENV === 'production') {
  const config_client = require('./webpack.config.client.babel.js')(sharedProdPlugins);
  const config_server = require('./webpack.config.server.babel.js')(sharedProdPlugins);
  config = [ config_client, config_server ];
}



// heroku
if(process.env.NODE_ENV === 'prodForHeroku') {
  const config_heroku = require('./webpack.config.heroku.babel.js')(sharedProdPlugins);
  config = config_heroku;
}


module.exports = config;

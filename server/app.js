const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

module.exports = function() {
  var app = express();

  app.set('port', process.env.PORT || 8080);
  app.set('root', path.join(__dirname + '../'));
  app.set('public', path.join(__dirname + '../public'));
  
  // upload
  app.use(bodyParser.json({ limit:'100mb' }));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100mb'
  }));
  
  app.use(methodOverride());
  
  // webpack with HMR
  if (process.env.NODE_ENV === 'devForClient' ||
      process.env.NODE_ENV ==='development') {
    const webpack = require('webpack');
    const webpackConfig = require('../webpack.config');
    const compiler = webpack(webpackConfig);
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
  }
  
  // routes
  app.use(require('./routes'));
  
  
  if (process.env.NODE_ENV === 'devForClient' ||
      process.env.NODE_ENV === 'devForServer' ||
      process.env.NODE_ENV === 'development') {
    
    const errorHandler = require('errorhandler');
    app.use(errorHandler());
  }
  
  return app;
};
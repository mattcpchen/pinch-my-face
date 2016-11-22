const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');

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
  if(app.get('env') =='devForClient' || app.get('env') =='development') {
    const webpack = require('webpack');
    const webpackConfig = require('../webpack.config');
    const compiler = webpack(webpackConfig);
    
    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }));
    app.use(require('webpack-hot-middleware')(compiler));
  }
  
  // routes
  app.use(require('./routes'));
  
  
  if (app.get('env') === 'devForClient' ||
      app.get('env') === 'devForServer' ||
      app.get('env') === 'development') {
    app.use(errorHandler());
  }
  
  return app;
};
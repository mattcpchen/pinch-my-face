'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

module.exports = function () {
  var app = express();

  app.set('port', process.env.PORT || 8080);
  app.set('root', path.join(__dirname + '../'));
  app.set('public', path.join(__dirname + '../public'));

  // upload
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100mb'
  }));

  app.use(methodOverride());

  // webpack with HMR
  if (process.env.NODE_ENV === 'devForClient' || process.env.NODE_ENV === 'development') {
    var webpack = require('webpack');
    var webpackConfig = require('../webpack.config');
    var compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }));
    app.use(require('webpack-hot-middleware')(compiler));
  }

  // routes
  app.use(require('./routes'));

  if (process.env.NODE_ENV === 'devForClient' || process.env.NODE_ENV === 'devForServer' || process.env.NODE_ENV === 'development') {
    app.use(errorHandler());
  }

  return app;
};
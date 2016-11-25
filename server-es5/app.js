'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var app = (0, _express2.default)();

  app.set('port', process.env.PORT || 8080);
  app.set('root', _path2.default.join(__dirname + '../'));
  app.set('public', _path2.default.join(__dirname + '../public'));

  // upload
  app.use(_bodyParser2.default.json({ limit: '100mb' }));
  app.use(_bodyParser2.default.urlencoded({
    extended: true,
    limit: '100mb'
  }));

  app.use((0, _methodOverride2.default)());

  // webpack with HMR
  if (process.env.NODE_ENV === 'devForClient' || process.env.NODE_ENV === 'development') {
    var webpack = require('webpack');
    var webpackConfig = require('../webpack.config');
    var compiler = webpack(webpackConfig);
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');

    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
  }

  // routes
  app.use(require('./routes'));

  if (process.env.NODE_ENV !== 'production') {
    var errorHandler = require('errorhandler');
    app.use(errorHandler());
  }

  return app;
};
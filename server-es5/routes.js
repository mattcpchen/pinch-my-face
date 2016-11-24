'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// static
router.use(_express2.default.static(__dirname + '/../public'));
router.use(_express2.default.static(__dirname + '/../dist'));

// index
// router.get('*', _index);
router.get('/', _renderIndex);
router.get('/upload/:pname', _renderIndex);

module.exports = router;

function _renderIndex(req, res) {
  var indexHtmlPath = _path2.default.join(__dirname, '../public/index.html');
  res.sendFile(indexHtmlPath);
}
'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _indexCtrl = require('./controllers/indexCtrl');

var _indexCtrl2 = _interopRequireDefault(_indexCtrl);

var _photoCtrl = require('./controllers/photoCtrl');

var _photoCtrl2 = _interopRequireDefault(_photoCtrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// static
router.use(_express2.default.static(__dirname + '/../public'));
router.use(_express2.default.static(__dirname + '/../dist'));

// index
// router.get('*', _index);
router.get('/', _indexCtrl2.default.index);

// photo
router.post('/upload_api/clear', _photoCtrl2.default.clearTmpFolder);
router.post('/upload_api/upload', _photoCtrl2.default.uploadPhoto);

module.exports = router;
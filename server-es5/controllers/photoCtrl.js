'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  clearTmpFolder: clearTmpFolder,
  uploadPhoto: uploadPhoto
};

function clearTmpFolder(req, res) {
  var tmpFolderPath = 'public/images/tmp/';
  _fs2.default.readdir(tmpFolderPath, function (err, files) {
    if (err) throw err;

    files = files.filter(function (item) {
      return item !== 'empty.jpg';
    });
    if (files.length === 0) {
      res.status(200).json({ message: 'tmp folder is empty.' });
    } else {
      files.forEach(function (item, index, array) {
        _fs2.default.unlink(tmpFolderPath + item, function (err) {
          if (err) throw err;
          console.log('===> ', item + ' is deleted.');
        });
      });
      res.status(200).json({ message: files });
    }
  });
}

function uploadPhoto(req, res) {
  var imgBase64Data = req.body.imgBase64Data;
  var filename = req.body.filename;
  var photoImgName = filename + '.jpg';
  var photoImgUrl = 'public/images/tmp/' + photoImgName;

  _fs2.default.writeFile(photoImgUrl, imgBase64Data, 'base64', function (err) {
    if (err) throw err;

    res.status(200).json({ imgName: photoImgName });
  });
}
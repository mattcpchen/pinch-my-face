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
  // const tmpFolderPath = 'public/images/tmp/';
  // fs.readdir(tmpFolderPath, (err,files) => {
  //   if (err) throw err;
  //   files.forEach((item, index, array) => {
  //     fs.unlink(tmpFolderPath + item, function(err){
  //       if (err) throw err;
  //       console.log('===> ', item + ' deleted');
  //     });
  //   });
  // });
}

function uploadPhoto(req, res) {
  var imgUrlPath = 'public/images/tmp/';
  var randomName = _generateRanName();
  var photoImgUrl = imgUrlPath + randomName + '_photo.jpg';
  var dataURI = req.body.imageDataURI;

  var base64Data = dataURI.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

  _fs2.default.writeFile(photoImgUrl, base64Data, 'base64', function (err) {
    if (err) throw err;

    _readOriginalImage(req, res, photoImgUrl);
  });
}

function _readOriginalImage(req, res, photoImgUrl) {
  _jimp2.default.read(photoImgUrl, function (err, lenna) {
    if (err) throw err;

    // imgUrl and faceUrl
    var imgUrlPath = photoImgUrl.substr(0, photoImgUrl.lastIndexOf('/') + 1);
    var randomName = photoImgUrl.split('/').pop().split('_photo')[0];
    var faceImgUrl = imgUrlPath + randomName + '_face.jpg';

    // faceImgData
    var faceImgW = Number(req.body.faceWidth);
    var faceImgH = Number(req.body.faceHeight);
    var faceImgX = Number(req.body.faceOffLeft);
    var faceImgY = Number(req.body.faceOffTop);

    // faceImage
    lenna.clone().crop(faceImgX, faceImgY, faceImgW, faceImgH).write(faceImgUrl, function (err) {
      if (err) throw err;

      res.json(200, {
        imgName: randomName
      });
    });
  });
}

function _generateRanName() {
  var possible1 = '0123456789';
  var possible2 = 'abcdefghijklmnopqrstuvwxyz';

  var ranName = '';
  for (var i = 0; i < 3; i += 1) {
    ranName += possible1.charAt(Math.floor(Math.random() * possible1.length));
  }
  for (var i = 0; i < 3; i += 1) {
    ranName += possible2.charAt(Math.floor(Math.random() * possible2.length));
  }

  return ranName;
}
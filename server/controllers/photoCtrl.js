import path from 'path';
import fs from 'fs';
import jimp from 'jimp';




module.exports = {
  clearTmpFolder: clearTmpFolder,
  uploadPhoto: uploadPhoto
};




function clearTmpFolder(req, res) {
  const tmpFolderPath = 'public/images/tmp/';
  fs.readdir(tmpFolderPath, (err,files) => {
    if (err) throw err;
    files.forEach((item, index, array) => {
      fs.unlink(tmpFolderPath + item, function(err){
        if (err) throw err;
        console.log('===> ', item + ' deleted');
      });
    });
  });
}


function uploadPhoto(req, res) {
  const imgUrlPath = 'public/images/tmp/';
  const randomName = _generateRanName();
  const photoImgUrl = imgUrlPath +randomName+ '_photo.jpg';
  const dataURI = req.body.imageDataURI;
  
  var base64Data = dataURI.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
  
  fs.writeFile(photoImgUrl, base64Data, 'base64', function(err) {
    if(err) throw err;

    _readOriginalImage(req, res, photoImgUrl);
  });
}


function _readOriginalImage(req, res, photoImgUrl) {
  jimp.read(photoImgUrl, function (err, lenna) {
    if (err) throw err;
    
    // imgUrl and faceUrl
    const imgUrlPath = photoImgUrl.substr(0, photoImgUrl.lastIndexOf('/')+1);
    const randomName = photoImgUrl.split('/').pop().split('_photo')[0];
    const faceImgUrl = imgUrlPath +randomName+ '_face.jpg';
    
    // faceImgData
      const faceImgW = Number(req.body.faceWidth);
      const faceImgH = Number(req.body.faceHeight);
      const faceImgX = Number(req.body.faceOffLeft);
      const faceImgY = Number(req.body.faceOffTop);
  
    // faceImage
    lenna.clone()
      .crop(faceImgX, faceImgY, faceImgW, faceImgH)
      .write(faceImgUrl, (err) => {
        if(err) throw err;
  
        res.json(200, {
          imgName: randomName
        });
      });
  });
}





function _generateRanName() {
  const possible1 = '0123456789';
  const possible2 = 'abcdefghijklmnopqrstuvwxyz';
  
  let ranName ='';
  for(var i=0; i < 3; i+=1) {
    ranName += possible1.charAt(Math.floor(Math.random() * possible1.length));
  }
  for(var i=0; i < 3; i+=1) {
    ranName += possible2.charAt(Math.floor(Math.random() * possible2.length));
  }
  
  return ranName;
}


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
  const imgBase64Data = req.body.imgBase64Data;
  const filename = req.body.filename;
  const photoImgName = filename+ '.jpg';
  const photoImgUrl = 'public/images/tmp/' + photoImgName;
  
  fs.writeFile(photoImgUrl, imgBase64Data, 'base64', function(err) {
    if(err) throw err;
    
    res.json(200, {
      imgName: photoImgName
    });
  });
}





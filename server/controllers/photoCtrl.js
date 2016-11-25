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
    
    if(files.length === 1) {
      res.status(200).json({message: 'tmp folder is empty.'});
    } else {
      files.forEach((item, index, array) => {
        if(item === 'empty.jpg') return;
        fs.unlink(tmpFolderPath + item, function(err){
          if (err) throw err;
          console.log('===> ', item +' is deleted.')
        });
      });
      res.status(200).json({message: files});
    }
  });
}


function uploadPhoto(req, res) {
  const imgBase64Data = req.body.imgBase64Data;
  const filename = req.body.filename;
  const photoImgName = filename+ '.jpg';
  const photoImgUrl = 'public/images/tmp/' + photoImgName;
  
  fs.writeFile(photoImgUrl, imgBase64Data, 'base64', function(err) {
    if(err) throw err;
  
    res.status(200).json({ imgName: photoImgName });
  });
}





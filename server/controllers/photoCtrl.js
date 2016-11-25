import fs from 'fs';




module.exports = {
  clearTmpFolder: clearTmpFolder,
  uploadPhoto: uploadPhoto
};




function clearTmpFolder(req, res) {
  const tmpFolderPath = 'public/images/tmp/';
  fs.readdir(tmpFolderPath, (err,files) => {
    if (err) throw err;
    
    files = files.filter(item => item !== 'empty.jpg');
    if(files.length === 0) {
      res.status(200).json({message: 'tmp folder is empty.'});
    } else {
      files.forEach((item, index, array) => {
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





import uiElements from '../../common/uiElements';
import helpers from '../../common/helpers';
import fbaseHandler from '../../common/firebase';



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// General
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const resetUploadPhotoElm = () => {
  uiElements.uploadPhoto.src = '';
  uiElements.uploadPhoto.style.width = "auto";
  uiElements.uploadPhoto.style.height = "auto";
  uiElements.uploadPhoto.style.left = "0";
  uiElements.uploadPhoto.style.top = "0";
  
  uiElements.uploadPhotoFile.value='';
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Upload
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const filterUploadMimeType = (event) => {
  const mimeType = event.target.files[0].type;
  const isJpg = mimeType === 'image/jpg';
  const isJpeg = mimeType === 'image/jpeg';
  const isPng = mimeType === 'image/png';
  const isGif = mimeType === 'image/gif';
  return (isJpg || isJpeg || isPng || isGif);
};

const uploadPhotoToStage = (event) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      const img = uiElements.uploadPhoto;
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  });
};


const initPhotoOnStage = (imgData) => {
  let imgW = imgData.width;
  let imgH = imgData.height;
  let imgScale = 1;
  if(imgW>600 && imgH>600) {
    imgScale = Math.max(600/imgW, 600/imgH);
  } else if(imgW<300 || imgH<300) {
    imgScale = Math.max(300/imgW, 300/imgH);
  }
  imgW = imgW*imgScale;
  imgH = imgH*imgScale;
  
  const width = imgW;
  const height = imgH;
  const left = 150 - (imgW-300)/2;
  const top = 100 - (imgH-300)/2;
  return {width, height, left, top};
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// UploadSave
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const createUploadImgData = (canvasW, canvasH, imgData) => {
  const img = imgData.img;
  const imgW = imgData.width;
  const imgH = imgData.height;
  const imgX = imgData.left;
  const imgY = imgData.top;
  const imgOffX = imgData.imgOffX;
  const imgOffY = imgData.imgOffY;
  var canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  var ctx = canvas.getContext("2d");
  
  //background
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  ctx.fill();
  //image
  ctx.drawImage(img, imgX-imgOffX, imgY-imgOffY, imgW, imgH);
  
  return canvas.toDataURL();
};

const uploadToFirebase = (uploadData) => {
  return new Promise((resolve, reject) => {
    _updateImagePhotoToFirebase([{
        type: 'body',
        filename: uploadData.filename + '_body',
        imgBase64Data: uploadData.bgBase64Data
      }, {
        type: 'face',
        filename: uploadData.filename + '_face',
        imgBase64Data: uploadData.faceBase64Data
      }], {},
      function(imgUrls) {
        resolve({ status: 'SUCCESS', imgUrls: imgUrls });
      }, function() {
        //resolve({ status: 'ERROR', message: this.status +': ' +this.statusText });
      });
  });
};




export default {
  resetUploadPhotoElm,
  
  filterUploadMimeType,
  uploadPhotoToStage,
  initPhotoOnStage,
  
  createUploadImgData,
  uploadToFirebase
}





function _updateImagePhotoToFirebase(uploadDataArr, imgUrls, callbackOK, callbackError) {
  if(uploadDataArr.length ===0) {
    callbackOK(imgUrls);
    return;
  }
  
  const uploadData = uploadDataArr.shift();
  const storageRef = fbaseHandler.storageRef;
  storageRef
    .child('images/tmp/' + uploadData.filename)
    .putString(uploadData.imgBase64Data, 'base64')
    .then(function(snapshot) {
      const imgType = uploadData.type;
      const url = snapshot.metadata.downloadURLs[0];
      imgUrls[imgType] = url;
      _updateImagePhotoToFirebase(uploadDataArr, imgUrls, callbackOK, callbackError);
    });
}
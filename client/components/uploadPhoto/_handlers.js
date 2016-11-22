import uiElements from '../../common/uiElements';




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
const createImgData = (canvasW, canvasH, img, imgW, imgH, imgX, imgY) => {
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
  ctx.drawImage(img, imgX, imgY, imgW, imgH);
  
  return canvas.toDataURL();
};

const makeAjaxCallToUplod = (uploadData) => {
  alert('Upload your own photo is not supported online yet. Please download the repo and run locally to see this feature.')
  // return new Promise((resolve, reject) => {
  //   var xhttp = new XMLHttpRequest();
  //   xhttp.open("POST", "/upload_api/upload", true);
  //   xhttp.setRequestHeader("Content-type", "application/json");
  //   xhttp.onload = function () {
  //     if(this.status == 200) {
  //       const response = JSON.parse(this.responseText);
  //       resolve({ status: 'SUCCESS', name: response.imgName });
  //     } else {
  //       resolve({ status: 'ERROR', message: this.status +': ' +this.statusText });
  //     }
  //   };
  //   xhttp.onerror = () => {
  //     resolve({ status: 'ERROR', message: this.status +': ' +this.statusText });
  //   };
  //   xhttp.send(JSON.stringify(uploadData));
  // });
};











export default {
  resetUploadPhotoElm,
  
  filterUploadMimeType,
  uploadPhotoToStage,
  initPhotoOnStage,
  
  createImgData,
  makeAjaxCallToUplod
}
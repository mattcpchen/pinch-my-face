import Rx from 'rxjs';
import uiElements from '../../common/uiElements';
import helpers from '../../common/helpers';
import handlers from './_handlers';
import { uploadAndDragPhoto$ } from './preloadPhoto'



const clickUploadOKBtn$ = Rx.Observable.fromEvent(uiElements.uploadOK, 'click');
const clickUploadCancelBtn$ = Rx.Observable.fromEvent(uiElements.uploadCancel, 'click');
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// clickToUpload
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const clickToUploadANewPhoto$ = clickUploadOKBtn$
  .withLatestFrom(
    uploadAndDragPhoto$,
    (event, imgData) => {
      helpers.displayPmfLoader(true);
      
      const img = uiElements.uploadPhoto;
      const bgDataURI = handlers.createUploadImgData(600, 600, Object.assign({}, imgData, {
        img: img,
        imgOffX: 0,
        imgOffY: 0
      }));
      const faceDataURI = handlers.createUploadImgData(300, 300, Object.assign({}, imgData, {
        img: img,
        imgOffX: 150,
        imgOffY: 100
      }));
  
      const filename = helpers.generateRanName();
      const bgBase64Data = bgDataURI.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
      const faceBase64Data = faceDataURI.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
      
      return { filename, bgBase64Data, faceBase64Data }
    })
  .map(uploadData => {
    return [{
      type: 'body',
      filename: uploadData.filename + '_body',
      imgBase64Data: uploadData.bgBase64Data
    }, {
      type: 'face',
      filename: uploadData.filename + '_face',
      imgBase64Data: uploadData.faceBase64Data
    }];
  })
  .flatMap(uploadDataArr => Rx.Observable.fromPromise(
    handlers.uploadToServer(uploadDataArr)
  ))
  .map(rtn => {
    if(rtn.status === 'ERROR') {
      alert(rtn.message);
      helpers.displayPmfLoader(false);
      return 'uploadError';
    } else {
      helpers.displayPmfLoader(false);
      return rtn.imgUrls;
    }
  })
  .share();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// clickToCancel
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const clickToCancelUpload = clickUploadCancelBtn$;




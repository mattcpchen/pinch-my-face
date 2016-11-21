import Rx from 'rxjs';
import uiElements from '../../common/uiElements';
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
      const img = uiElements.uploadPhoto;
      const imgW = imgData.width;
      const imgH = imgData.height;
      const imgX = imgData.left;
      const imgY = imgData.top;
      const bgDataURI = handlers.createImgData(600, 600, img, imgW, imgH, imgX, imgY);
      return {
        imageDataURI : bgDataURI,
        faceWidth: 300,
        faceHeight: 300,
        faceOffLeft: 150,
        faceOffTop: 100
      }
    })
  .flatMap(uploadData => Rx.Observable.fromPromise(
    handlers.makeAjaxCallToUplod(uploadData)
  ))
  .map(rtn => {
    if(rtn.status === 'ERROR') {
      alert(rtn.message);
      return 'uploadError';
    } else {
      return rtn.name;
    }
  })
  .share();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// clickToCancel
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const clickToCancelUpload = clickUploadCancelBtn$;




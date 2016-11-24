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
  .flatMap(uploadData => Rx.Observable.fromPromise(
    handlers.uploadToFirebase(uploadData)
  ))
  .map(rtn => {
    if(rtn.status === 'ERROR') {
      alert(rtn.message);
      return 'uploadError';
    } else {
      return rtn.imgUrls;
    }
  })
  .share();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// clickToCancel
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const clickToCancelUpload = clickUploadCancelBtn$;




import Rx from 'rxjs';
import uiElements from '../../common/uiElements';
import helpers from '../../common/helpers';
import handlers from './_handlers';


export const clickUploadBtn$ = Rx.Observable.fromEvent(uiElements.uploadPhotoFile, 'change').share();

const clickMouseDownPhoto$ = Rx.Observable.fromEvent(uiElements.uploadPhoto, 'mousedown');
const clickMouseMovePhoto$ = Rx.Observable.fromEvent(uiElements.uploadPhoto, 'mousemove');
const clickMouseUpAll$ = Rx.Observable.fromEvent(document, 'mouseup').share();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Upload to stage
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const uploadedPhoto$ = clickUploadBtn$
  .filter(event => {
    const result = handlers.filterUploadMimeType(event);
    if(!result) {
      alert('Only image files are allowed.');
    }
    return result;
  })
  .flatMap(event => {
    return Rx.Observable.fromPromise(handlers.uploadPhotoToStage(event));
  })
  .map(imgData => {
    helpers.switchStageMode('uploadMode');
    return handlers.initPhotoOnStage(imgData);
  })
  //.do(x => console.log('uploadedPhoto===>', x))
  .share();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// MouseDrag Photo
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const clickToInitDragging$ = clickMouseDownPhoto$
  .withLatestFrom(uploadedPhoto$, (event, initData) => {
      event.preventDefault();
      helpers.enableMouseEvents(uiElements.uploadCtrls, false);
      const dragImage = uiElements.uploadPhoto;
      const imageOffset = {
        width: initData.width,
        height: initData.height,
        left: event.clientX - dragImage.offsetLeft,
        top: event.clientY - dragImage.offsetTop
      };
      return (imageOffset);
    }
  );

const clickToStartDragging$ = clickToInitDragging$
  .flatMap((imageOffset) => {
    return clickMouseMovePhoto$
      .map((pos) => ({
        width: imageOffset.width,
        height: imageOffset.height,
        left: pos.clientX - imageOffset.left,
        top: pos.clientY - imageOffset.top
      }))
      .takeUntil(clickMouseUpAll$.map(e => {
        helpers.enableMouseEvents(uiElements.uploadCtrls, true);
      }));
  });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const uploadAndDragPhoto$ = Rx.Observable
  .merge(uploadedPhoto$, clickToStartDragging$)
  .share();

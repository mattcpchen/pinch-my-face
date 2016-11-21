import Rx from 'rxjs';
import uiElements from '../../common/uiElements';
import { clickToInitPMFBoxes$ } from './initFBoxes';




const filterForKeyEvents = (clickNum, clickToInitPMFBoxes) => {
  // keyEvents only allow for 3x3
  const settings = clickToInitPMFBoxes.settings;
  const totalRows = settings.totalRows;
  const totalCols = settings.totalCols;
  const photo = settings.photos[settings.photoId];
  const gridStatus = settings.gridStatus;
  
  const allowKeyEvents = (totalRows===3 && totalCols===3) &&
    (photo==='none' || gridStatus);
  
  return allowKeyEvents? clickNum : -1;
};
//++++++++++++++++++++++++++++++++++++++++++++++++
// Key Down/Up --- document
//++++++++++++++++++++++++++++++++++++++++++++++++
export const clickKeyDown$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .map(e => e.keyCode-49+1)
  .withLatestFrom(clickToInitPMFBoxes$, filterForKeyEvents)
  .filter(clickNum => clickNum>=1 && clickNum<=9)
  .map(clickNum => clickNum-1);

export const clickKeyUp$ = Rx.Observable
  .fromEvent(document, 'keyup')
  .map(e => e.keyCode-49+1)
  .withLatestFrom(clickToInitPMFBoxes$, filterForKeyEvents)
  .filter(clickNum => clickNum>=1 && clickNum<=9)
  .map(clickNum => clickNum-1);
//++++++++++++++++++++++++++++++++++++++++++++++++
// Mouse Down/Up --- allFaceBoxes
//++++++++++++++++++++++++++++++++++++++++++++++++
export const clickMouseDown$ = Rx.Observable
  .fromEvent(uiElements.faceBoxes, 'mousedown')
  .filter(e => e.target.id.indexOf('_') >=0)
  .withLatestFrom(
    clickToInitPMFBoxes$,
    (e, clickToInitPMFBoxes) => {
      const rowcol = e.target.id.split('_')[1];
      const row = Number(rowcol[0]);
      const col = Number(rowcol[1]);
      const totalRows = clickToInitPMFBoxes.settings.totalRows;

      return totalRows * row + col;
  })
  .share();


export const clickMouseUp$ = Rx.Observable
  .fromEvent(uiElements.faceBoxes, 'mouseup')
  .filter(e => e.target.id.indexOf('_') >=0);
//++++++++++++++++++++++++++++++++++++++++++++++++
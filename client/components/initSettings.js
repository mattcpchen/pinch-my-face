import Rx from 'rxjs';
import uiElements from '../common/uiElements';
import { INIT_FACE_SETTINGS, INIT_FACE_PHOTOS, INIT_FACE_GRID, INIT_ANIME_SETTINGS } from '../common/constants';
import { clickToUploadANewPhoto$ } from './uploadPhoto/uploadPhoto';






export const clickDropdown$ = Rx.Observable.fromEvent(uiElements.sizeDropdown, 'change').share();
export const clickGridBtn$ = Rx.Observable.fromEvent(uiElements.gridBtn, 'click').share();
export const clickAnimeStyleBtn$ = Rx.Observable.fromEvent(uiElements.animeStyleBtn, 'click').share();

export const clickStartBtn$ = Rx.Observable.fromEvent(uiElements.startBtn, 'click').share();
export const clickLArrowBtn$ = Rx.Observable.fromEvent(uiElements.arrowLeft, 'click').share();
export const clickRArrowBtn$ = Rx.Observable.fromEvent(uiElements.arrowRight, 'click').share();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// faceSettings
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const initFaceSettings$ = Rx.Observable.of(INIT_FACE_SETTINGS);

export const faceSettings$ = clickDropdown$
  .map(event => event.target.value.split('x'))
  .startWith(['3','3'])
  .withLatestFrom(
    initFaceSettings$,
    (sizeArr, initFaceSettings) => {
      const totalRows = parseInt(sizeArr[0]);
      const totalCols = parseInt(sizeArr[1]);
      const totalWidth = initFaceSettings.totalWidth;
      const totalHeight = initFaceSettings.totalHeight;
      const boxWidthMax = (totalWidth/totalRows)*2;
      const boxHeightMax = (totalHeight/totalCols)*2;
      const boxWidthMin = (totalWidth/totalRows)*0.5;
      const boxHeightMin = (totalHeight/totalCols)*0.5;

      return Object.assign({}, initFaceSettings, {
        totalWidth, totalHeight, totalRows, totalCols,
        boxWidthMax, boxHeightMax, boxWidthMin, boxHeightMin
      });
    }
  )
  //.do(x => console.log('faceSettings: ', x))
  .share();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// faceGrid
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const initFaceGrid$ = Rx.Observable.of(INIT_FACE_GRID);

export const faceGrid$ = clickGridBtn$
  .withLatestFrom(
    initFaceGrid$,
    (event, faceGrid) => {
      faceGrid.status = !faceGrid.status;
      return faceGrid;
    }
  )
  .startWith(INIT_FACE_GRID)
  //.do(x => console.log('faceGrid: ', x))
  .share();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// animeSettings
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const initAnimeSettings$ = Rx.Observable.of(INIT_ANIME_SETTINGS);

export const animeSettings$ = clickAnimeStyleBtn$
  .withLatestFrom(
    initAnimeSettings$,
    (event, animeSettings) => {
      animeSettings.style = (animeSettings.style === 'grab')?'squeeze' : 'grab';
      return animeSettings;
    }
  )
  .startWith(INIT_ANIME_SETTINGS)
  //.do(x => console.log('faceGrid: ', x))
  .publishReplay(1)
  .refCount();


export const clickToUpdateAnimeStyle$ = clickAnimeStyleBtn$
  .withLatestFrom(
    animeSettings$,
    (event, animeSettings) => {
      return animeSettings;
    }
  );
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// facePhotos
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const initFacePhotos$ = Rx.Observable.of(INIT_FACE_PHOTOS).share();


const clickToUploadANewPhotoSuccess$ = clickToUploadANewPhoto$
  .filter(newPhotoName => newPhotoName!=='uploadError')
  .share();

const facePhotosAfterUpload$ = clickToUploadANewPhotoSuccess$
  .withLatestFrom(initFacePhotos$, (newPhoto, facePhotos) => {
    const newPid = facePhotos.pid + 1;
    const photos = facePhotos.photos;
    facePhotos.pid = newPid;
    facePhotos.photos = [
      ...photos.slice(0, newPid),
      newPhoto,
      ...photos.slice(newPid)
    ];
    return facePhotos;
  })
  .startWith(INIT_FACE_PHOTOS);


export const facePhotos$ = Rx.Observable
  .merge(
    clickStartBtn$.mapTo(0),
    clickToUploadANewPhotoSuccess$.mapTo(0),
    clickLArrowBtn$.mapTo(-1),
    clickRArrowBtn$.mapTo(1)
  )
  .withLatestFrom(
    facePhotosAfterUpload$,
    (dir, facePhotos) => {
      let nextPid = facePhotos.pid + dir;
      nextPid = (nextPid > facePhotos.photos.length-1)? 0 : nextPid;
      nextPid = (nextPid < 0)? (facePhotos.photos.length-1) : nextPid;
      facePhotos.pid = nextPid;
      return facePhotos;
    }
  )
  //.do(x => console.log('facePhoto: ', x))
  .share();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++








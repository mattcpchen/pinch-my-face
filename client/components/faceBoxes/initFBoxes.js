import Rx from 'rxjs';
import { INIT_FACE_SETTINGS, INIT_FACE_PHOTOS, INIT_FACE_GRID, INIT_ANIME_SETTINGS } from '../../common/constants';
import { faceSettings$, faceGrid$, facePhotos$, animeSettings$ } from '../initSettings';
import handlers from './_handlers';




const initFaceSettings$ = Rx.Observable.of(INIT_FACE_SETTINGS);
const initFaceGrid$ = Rx.Observable.of(INIT_FACE_GRID);
const initFacePhotos$ = Rx.Observable.of(INIT_FACE_PHOTOS);
const initAnimeSettings$ = Rx.Observable.of(INIT_ANIME_SETTINGS);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// fbBoxesSettings
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const fbBoxesSettings$ = initFaceSettings$
  .map( ({totalWidth, totalHeight, totalRows, totalCols}) => {
    const initWidths = Array
      .apply(null, Array(totalRows))
      .map(() => totalWidth/totalRows);
    const initHeights = Array
      .apply(null, Array(totalCols))
      .map(() => totalHeight/totalCols);

    const boxWHs = {
      initWidths,
      initHeights,
      widths: initWidths,
      heights: initHeights,
      velWidths: Array.apply(null, Array(totalRows)),
      velHeights:Array.apply(null, Array(totalCols))
    };

    const faceBoxes = Array
      .apply(null, Array(totalRows*totalCols))
      .map((item, index) => ({
        id: 'faceBox_' + Math.floor(index/totalRows) + (index % totalRows)
      }));

    return { boxWHs, faceBoxes };
  });


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// clickEvents
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const clickToInitOriSettings = Rx.Observable.combineLatest(
  initFaceSettings$,
  initFaceGrid$,
  initFacePhotos$,
  initAnimeSettings$,
  (faceSettings, faceGrid, facePhotos, animeSettings) => {
    return Object.assign({}, faceSettings, {
      gridStatus: faceGrid.status,
      photoId: facePhotos.pid,
      photos: facePhotos.photos,
      animeStyle: animeSettings.style,
      animeAcc: animeSettings.acc,
      animeSlow: animeSettings.slow,
      animeDVel: animeSettings.dVel
    });
  });


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// initPmfBoxes
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const initPmfBoxes$ = clickToInitOriSettings
  .withLatestFrom(
    fbBoxesSettings$,
    (settings, fbBoxesSettings) => {
      return {
        settings,
        boxWHs: fbBoxesSettings.boxWHs,
        faceBoxes: fbBoxesSettings.faceBoxes
      };
    });
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const clickToReinitSettings = Rx.Observable
  .combineLatest(
    faceSettings$,
    faceGrid$,
    facePhotos$,
    animeSettings$,
    (faceSettings, faceGrid, facePhotos, animeSettings) => {
      return Object.assign({}, faceSettings, {
        gridStatus: faceGrid.status,
        photoId: facePhotos.pid,
        photos: facePhotos.photos,
        animeStyle: animeSettings.style
      });
    });

export const clickToInitPMFBoxes$ = clickToReinitSettings
  .withLatestFrom(
    initPmfBoxes$,
    (settings, pmfBoxes) => {
      Object.assign(pmfBoxes.settings, settings);
      return handlers.initPMFBoxes(pmfBoxes);
    })
  //.do(x => console.log('clickToInitPMFBoxes$ ===> ', x))
  .publishReplay(1)
  .refCount();



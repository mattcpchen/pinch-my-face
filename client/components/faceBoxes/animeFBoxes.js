import Rx from 'rxjs';
import { clickAnimeStyleBtn$, clickDropdown$, clickGridBtn$, clickLArrowBtn$, clickRArrowBtn$ } from '../initSettings';
import { clickUploadBtn$ } from '../uploadPhoto/preloadPhoto';
import { clickToInitPMFBoxes$ } from './initFBoxes';
import { clickKeyDown$, clickKeyUp$, clickMouseDown$, clickMouseUp$ } from './animeFBoxesEvents';
import handlers from './_handlers';



const stopAnimeEvents$ = Rx.Observable.merge(
  clickAnimeStyleBtn$,
  clickLArrowBtn$,
  clickRArrowBtn$,
  clickUploadBtn$,
  clickDropdown$,
  clickGridBtn$,
  
  clickKeyDown$,
  clickMouseDown$
);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// animePMFBoxes_byKey
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const keyDownStream$ = clickKeyDown$
  .withLatestFrom(
    clickToInitPMFBoxes$,
    (index, pmfBoxes) => {
      return handlers.updatePMFBoxes(index, pmfBoxes);
    }
  );

const keyDownThenUpStream$ = clickKeyUp$
  .switchMapTo(Rx.Observable.interval(10)).take(200)
  .takeUntil( stopAnimeEvents$ )
  .repeat()
  .withLatestFrom(
    keyDownStream$,
    (index, pmfBoxes) => {
      return handlers.animePMFBoxes(pmfBoxes);
    }
  );
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// animePMFBoxes_byMouse
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const mouseDownStream$ = clickMouseDown$
  .withLatestFrom(
    clickToInitPMFBoxes$,
    (index, pmfBoxes) => {
      return handlers.updatePMFBoxes(index, pmfBoxes);
    }
  );

const mouseDownThenUpStream$ = clickMouseUp$
  .switchMapTo(Rx.Observable.interval(10)).take(200)
  .takeUntil( stopAnimeEvents$ )
  .repeat()
  .withLatestFrom(
    mouseDownStream$,
    (index, pmfBoxes) => {
      return handlers.animePMFBoxes(pmfBoxes);
    }
  );

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const animePMFBoxes_byKey$ = Rx.Observable
  .merge( keyDownStream$, keyDownThenUpStream$ );

const animePMFBoxes_byMouse$ = Rx.Observable
  .merge( mouseDownStream$, mouseDownThenUpStream$ );


export const clickToAnimePMFBoxes$ = Rx.Observable.merge(
  animePMFBoxes_byKey$,
  animePMFBoxes_byMouse$
);



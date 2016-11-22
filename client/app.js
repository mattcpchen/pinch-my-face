import Rx from 'rxjs';
import styles from './app.scss';
import uiElements from './common/uiElements';
import { INIT_FACE_SETTINGS } from './common/constants';
import helpers from './common/helpers';
import fbHandler from './components/faceBoxes/_handlers';
import uploadHandlers from './components/uploadPhoto/_handlers';
import { clickStartBtn$, clickToUpdateAnimeStyle$ } from './components/initSettings';
import { clickToInitPMFBoxes$ } from './components/faceBoxes/initFBoxes';
import { clickToAnimePMFBoxes$ } from './components/faceBoxes/animeFBoxes';
import { clickUploadBtn$, uploadAndDragPhoto$ } from './components/uploadPhoto/preloadPhoto';
import { clickToUploadANewPhoto$, clickToCancelUpload } from './components/uploadPhoto/uploadPhoto';


helpers.initAllUI(INIT_FACE_SETTINGS.totalWidth, INIT_FACE_SETTINGS.totalHeight);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// initSettings
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
clickStartBtn$.subscribe(event => {
  uiElements.instruction.style.display = 'none';
  helpers.switchStageMode('playMode');
});


clickToUpdateAnimeStyle$.subscribe(animeSettings => {
  const animeStyle =helpers.capitalizeRandomChar(animeSettings.style);
  uiElements.animeStyleBtn.innerHTML = animeStyle;
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// animation
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
clickToInitPMFBoxes$
  .subscribe(pmfBoxes => {
    const settings = pmfBoxes.settings;
    const faceBoxes = pmfBoxes.faceBoxes;
  
    helpers.updateFaceBoxes(settings);
    faceBoxes.forEach((box,index) => {
      helpers.drawEachFaceBox(index, settings, box);
    });
  });


clickToAnimePMFBoxes$.subscribe(pmfBoxes => {
    const settings = pmfBoxes.settings;
    const faceBoxes = pmfBoxes.faceBoxes;

    faceBoxes.forEach((box,index) => {
      helpers.drawEachFaceBox(index, settings, box);
    });
  });
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Preload photo
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
clickUploadBtn$.subscribe(event => {
  uiElements.uploadPhoto.style.display = 'none';
});

uploadAndDragPhoto$.subscribe(data => {
  if(data.width && data.height) { // only once when initUpload
    uiElements.uploadPhoto.style.width = data.width +'px';
    uiElements.uploadPhoto.style.height = data.height+'px';
    uiElements.uploadPhoto.style.display = 'initial';
  }
  uiElements.uploadPhoto.style.left = data.left +'px';
  uiElements.uploadPhoto.style.top = data.top+'px';
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Upload Photo
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
clickToUploadANewPhoto$.subscribe(event => {
  uploadHandlers.resetUploadPhotoElm();
  helpers.switchStageMode('playMode');
});

clickToCancelUpload.subscribe(event => {
  uploadHandlers.resetUploadPhotoElm();
  helpers.switchStageMode('playMode');
});










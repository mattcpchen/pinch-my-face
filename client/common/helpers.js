import uiElements from './uiElements';



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// general
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const convertIndexToRowCol = (index, totalRows) => {
  const row = Math.floor(index / totalRows);
  const col = index % totalRows;
  return { row, col }
};


const eventOutArray = (array, totalValues) => {
  return array
    .reduce((acc,item) => {
      const array = !acc[0]? [item] : [...acc[0].array, item];
      const total = !acc[0]? item : acc[0].total + item;
      return [ {array, total} ];
    }, [])
    .reduce((acc, item) => {
      const array = item.array;
      const total = item.total;
      return array.map(value => value*totalValues/total);
    },[]);
};

const capitalizeRandomChar = (string) => {
  return string
    .split('')
    .map(char => {
     return  (Math.floor(Math.random()*3) === 0)?
       char.toUpperCase() :
       char;
    })
    .join('');
};

const generateRanName = () => {
  const possible1 = '0123456789';
  const possible2 = 'abcdefghijklmnopqrstuvwxyz';
  
  let ranName ='';
  for(var i=0; i < 3; i+=1) {
    ranName += possible1.charAt(Math.floor(Math.random() * possible1.length));
  }
  for(var i=0; i < 3; i+=1) {
    ranName += possible2.charAt(Math.floor(Math.random() * possible2.length));
  }
  
  return ranName;
};

const displayPmfLoader = (state) => {
  if(state) {
    uiElements.pmfLoader.classList.add("pmfLoader-on");
  } else {
    uiElements.pmfLoader.classList.remove("pmfLoader-on");
  }
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ALL Modes
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const switchStageMode = (_mode) => {
  if(_mode === 'initMode') {
    uiElements.playCtrls.style.display = "none";
    uiElements.uploadCtrls.style.display = "none";
    uiElements.arrowLeft.style.visibility = "hidden";
    uiElements.arrowRight.style.visibility = "hidden";
    uiElements.uploadPhotoHolder.style.display = "none";
    uiElements.photoBGHolder.style.display = "none";
    uiElements.faceBoxes.style.display = "none";
  } else if(_mode === 'playMode') {
    uiElements.playCtrls.style.display = "block";
    uiElements.uploadCtrls.style.display = "none";
    uiElements.arrowLeft.style.visibility = "visible";
    uiElements.arrowRight.style.visibility = "visible";
    uiElements.uploadPhotoHolder.style.display = "none";
    uiElements.photoBGHolder.style.display = "block";
    uiElements.faceBoxes.style.display = "block";
  } else if (_mode === 'uploadMode') {
    uiElements.playCtrls.style.display = "none";
    uiElements.uploadCtrls.style.display = "block";
    uiElements.arrowLeft.style.visibility = "hidden";
    uiElements.arrowRight.style.visibility = "hidden";
    uiElements.uploadPhotoHolder.style.display = "block";
    uiElements.photoBGHolder.style.display = "none";
    uiElements.faceBoxes.style.display = "none";
  }
};

const enableMouseEvents = (elm, status) => {
  elm.style.pointerEvents = status? "initial" : 'none';
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PLAY --- faceBoxes --- init
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const clearTmpFolder = () => {
  // TODO: update in firebase
  // var xhttp = new XMLHttpRequest();
  // xhttp.open("POST", "/upload_api/clear", true);
  // xhttp.onload = function () {
  //   if(this.status == 200) {
  //     console.log(this.responseText);
  //   } else {
  //     console.log(this.status, this.statusText);
  //   }
  // };
  // xhttp.send();
};

const initAllUI = (totalWidth, totalHeight) => {
  uiElements.allPhotos.style.width = totalWidth +"px";
  uiElements.allPhotos.style.height = totalHeight +"px";
  uiElements.pinchMyFace.style.width = totalWidth + 100 +"px";
  uiElements.pinchMyFace.style.display = "block";
  
  switchStageMode('initMode');
  clearTmpFolder();
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PLAY --- faceBoxes --- update
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const updateFaceBoxes = (settings) => {
  const totalRows = settings.totalRows;
  const totalCols = settings.totalCols;
  const gridStatus = settings.gridStatus;
  const photo = settings.photos[settings.photoId];
  const photoBgUrl = photo.body==='none'? '':photo.body;
  const photoFaceUrl = photo.face==='none'? '':photo.face;
  const showGrid = photo.body==='none' || gridStatus;
  
  // updateAllUI
  uiElements.gridBtn.disabled = (photo.body==='none')? true : false;
  uiElements.gridBtn.style.opacity = (photo.body==='none')? 0.5 : 1;
  uiElements.gridBtn.style.cursor = (photo.body==='none')? 'default' : 'pointer';
  
  // updatePreviewPhoto
  uiElements.photoBG.style.backgroundImage = "url("+photoBgUrl+")";
  
  // grid
  if(gridStatus) {
    uiElements.gridBtn.classList.remove('grid-off');
    uiElements.gridBtn.classList.add('grid-on');
  } else {
    uiElements.gridBtn.classList.remove('grid-on');
    uiElements.gridBtn.classList.add('grid-off');
  }
  
  // generate faceBoxes
  // NOTE: <div class="faceBox row_0 col_0" id="faceBox_00"></div>
  uiElements.faceBoxes.innerHTML = "";
  for(var i=0; i<totalRows*totalCols; i++) {
    const row = Math.floor(i / totalRows);
    const col = i % totalRows;
    var div = document.createElement("div");
    div.setAttribute('class', 'faceBox row_' + row + ' col_' + col);
    div.setAttribute('id', 'faceBox_' + row + col);
    div.style = "background-image: url(" + photoFaceUrl + ")";
    div.style.border = (showGrid)? '1px solid #ccc': 'none';
  
    if(totalRows*totalCols===9 && showGrid) {
      var textDiv = document.createElement("div");
      var textNode = document.createTextNode(i+1);
      textDiv.setAttribute('class', 'faceBoxNum');
      textDiv.appendChild(textNode);
      div.appendChild(textDiv);
    }
  
    uiElements.faceBoxes.appendChild(div);
  }
};



const drawEachFaceBox = (index, settings, faceBox) => {
  const totalRows = settings.totalRows;
  const totalCols = settings.totalCols;
  const photo = settings.photos[settings.photoId];
  const id = faceBox.id;
  const x = faceBox.x;
  const y = faceBox.y;
  const w = faceBox.width;
  const h = faceBox.height;
  
  const faceBoxElm = document.getElementById(id);
  faceBoxElm.style.left = x +"px";
  faceBoxElm.style.top = y +"px";
  faceBoxElm.style.width = w +"px";
  faceBoxElm.style.height = h +"px";
  
  if(photo.body !== 'none') {
    // background-size
    faceBoxElm.style.backgroundSize= totalRows*w+'px ' +totalCols*h +'px';
    // background-position: 0, -(curW), -2*(urW)
    const rowcol = convertIndexToRowCol(index, totalRows);
    const rowIndex = rowcol.row;
    const colIndex = rowcol.col;
    faceBoxElm.style.backgroundPosition= '-' + (colIndex * w)+'px ' + '-' + (rowIndex * h) +'px';
  }
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// UPLOAD
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



export default {
  convertIndexToRowCol,
  eventOutArray,
  capitalizeRandomChar,
  generateRanName,
  displayPmfLoader,
  
  switchStageMode,
  enableMouseEvents,
  
  initAllUI,
  updateFaceBoxes,
  drawEachFaceBox
}
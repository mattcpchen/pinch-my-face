
export const INIT_FACE_SETTINGS = (() => {
  const totalWidth = 300;
  const totalHeight = 300;
  const totalRows = 3;
  const totalCols = 3;
  const boxWidthMax = (totalWidth/totalRows)*2;
  const boxHeightMax = (totalHeight/totalCols)*2;
  const boxWidthMin = (totalWidth/totalRows)*0.5;
  const boxHeightMin = (totalHeight/totalCols)*0.5;
  
  return {
    totalWidth, totalHeight, totalRows, totalCols,
    boxWidthMax, boxHeightMax, boxWidthMin, boxHeightMin
  };
})();

export const INIT_FACE_GRID = { status:false } ;

export const INIT_FACE_PHOTOS = {
  pid:0,
  photoBase: './images/',
  photos:[
    'none',
    './images/cpc01',
    './images/cpc02',
    './images/monalisa01',
    './images/hillary01',
    './images/hillary02',
    './images/trump01'
  ]
};

export const INIT_ANIME_SETTINGS = {
  style: 'grab', //'grab' or 'squeeze'
  acc: 100,
  slow: 1.03,
  dVel: 5
};








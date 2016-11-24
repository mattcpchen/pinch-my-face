
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
  photos : [
    {body: 'none', face:'none'},
    {body: './images/cpc01_body.jpg', face:'./images/cpc01_face.jpg'},
    {body: './images/cpc02_body.jpg', face:'./images/cpc02_face.jpg'},
    {body: './images/monalisa01_body.jpg', face:'./images/monalisa01_face.jpg'},
    {body: './images/hillary01_body.jpg', face:'./images/hillary01_face.jpg'},
    {body: './images/hillary02_body.jpg', face:'./images/hillary02_face.jpg'},
    {body: './images/trump01_body.jpg', face:'./images/trump01_face.jpg'}
  ]
};



export const INIT_ANIME_SETTINGS = {
  style: 'grab', //'grab' or 'squeeze'
  acc: 100,
  slow: 1.03,
  dVel: 5
};








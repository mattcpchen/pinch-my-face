import helpers from '../../common/helpers';



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Init
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const updateWHsByInit = (settings) => {
  const totalWidth = settings.totalWidth;
  const totalHeight = settings.totalHeight;
  const totalRows = settings.totalRows;
  const totalCols = settings.totalCols;
  
  const initWidths = Array.apply(null, Array(totalRows)).map(() => totalWidth/totalRows);
  const initHeights = Array.apply(null, Array(totalCols)).map(() => totalHeight/totalCols);
  const widths = initWidths;
  const heights = initHeights;
  const velWidths = initWidths.map(() => 0);
  const velHeights = initHeights.map(() => 0);
  
  return { initWidths, initHeights, widths, heights, velWidths, velHeights };
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const updateWHsByEvent = (index, settings, boxesWH) => {
  const totalWidth = settings.totalWidth;
  const totalHeight = settings.totalHeight;
  const totalRows = settings.totalRows;
  const totalCols = settings.totalCols;
  const boxWidthMax = settings.boxWidthMax;
  const boxHeightMax = settings.boxHeightMax;
  const boxWidthMin = settings.boxWidthMin;
  const boxHeightMin = settings.boxHeightMin;
  const dVel = settings.animeDVel;
  
  const rowcol = helpers.convertIndexToRowCol(index, totalRows);
  const row = rowcol.row;
  const col = rowcol.col;
  
  // widths, heights
  const style = settings.animeStyle;
  const activeBoxWidth = (style==='grab')? boxWidthMax : boxWidthMin;
  const activeBoxHeight = (style==='grab')? boxHeightMax : boxHeightMin;
  let widths = boxesWH.widths.map((val,i) => {
    return i===col? activeBoxWidth : (totalWidth-activeBoxWidth)/(totalRows-1);
  });
  let heights = boxesWH.heights.map((val,i) => {
    return i===row? activeBoxHeight : (totalHeight-activeBoxHeight)/(totalCols-1)
  });
  
  //velocity
  const velWidths = boxesWH.velWidths.map((val,i) => {
    return i===col? dVel : 0;
  });
  const velHeights = boxesWH.velHeights.map((val,i) => {
    return i===row? dVel : 0;
  });
  
  return Object.assign(boxesWH, { widths, heights, velWidths, velHeights });
};


const updateWHsByAnime = (settings, boxesWH) => {
  // Logic:
  // step1: vw1 = (vw1+(initWidth1-width1)/acc)/slow;
  // step2: vw123 = (vw1+vw2+vw3)/3
  // step3: vw1 = vw1 - vw123;
  // step4: width1 = width1 + v1;
  
  const acc = settings.animeAcc;
  const slow = settings.animeSlow;
  // velWidths
  let velWidths = boxesWH.velWidths
    .map((vw,i) => ( vw+(boxesWH.initWidths[i]-boxesWH.widths[i])/acc )/slow)
    .reduce( (acc,item,i,arr) =>{
        const avgTotal = acc[0].avgTotal + item/arr.length;
        return [ {arr,avgTotal} ];
      },[ {arr:[],avgTotal:0} ]
    )
    .map(data => {
      const arr = data.arr;
      const avgTotal = data.avgTotal;
      return arr.map(item => item-avgTotal);
    })
    .reduce((acc,item)=>item);
  
  
  // velHeights
  let velHeights = boxesWH.velHeights
    .map((vh,i) => ( vh+(boxesWH.initHeights[i]-boxesWH.heights[i])/acc )/slow)
    .reduce( (acc,item,i,arr) => {
        const avgTotal = acc[0].avgTotal + item/arr.length;
        return [ {arr,avgTotal} ];
      },[ {arr:[],avgTotal:0} ]
    )
    .map(data => {
      const arr = data.arr;
      const avgTotal = data.avgTotal;
      return arr.map(item => item-avgTotal);
    })
    .reduce((acc,item)=>item);
  
  
  let widths = boxesWH.widths.map((w,i) => w + velWidths[i]);
  
  let heights = boxesWH.heights.map((h,i) => h + velHeights[i]);
  
  return Object.assign(boxesWH, { widths, heights, velWidths, velHeights });
};



const updateFaceBoxes = (settings, boxWHs) => {
  const totalRows = settings.totalRows;
  const totalCols = settings.totalCols;
  const widths = boxWHs.widths;
  const heights = boxWHs.heights;
  
  return Array.apply(null, Array(totalRows*totalCols))
    .map((data, i) => {
      const row = Math.floor(i/totalRows);
      const col = i % totalRows;
      const id = 'faceBox_'+row+col;
      const width = widths[col];
      const height = heights[row];
      const x = widths.reduce((acc, item, index) => {
        acc += (index<col)? item : 0;
        return acc;
      },0);
      const y = heights.reduce((acc, item, index) => {
        acc += (index<row)? item : 0;
        return acc;
      },0);
      
      return { id, x, y, width, height };
    });
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const initPMFBoxes = (pmfBoxes) => {
  const settings = pmfBoxes.settings;
  const boxWHs = updateWHsByInit(settings);
  const faceBoxes = updateFaceBoxes(settings, boxWHs);
  return { settings, boxWHs, faceBoxes };
};

const updatePMFBoxes = (index, pmfBoxes) => {
  const settings = pmfBoxes.settings;
  const boxWHs = updateWHsByEvent(index, settings, pmfBoxes.boxWHs);
  const faceBoxes = updateFaceBoxes(settings, boxWHs);
  return { settings, boxWHs, faceBoxes };
};

const animePMFBoxes = (newPmfBoxes) => {
  const settings = newPmfBoxes.settings;
  const boxWHs = updateWHsByAnime(settings, newPmfBoxes.boxWHs);
  const faceBoxes = updateFaceBoxes(settings, boxWHs);
  return { settings, boxWHs, faceBoxes };
};



export default {
  initPMFBoxes,
  updatePMFBoxes,
  animePMFBoxes
}
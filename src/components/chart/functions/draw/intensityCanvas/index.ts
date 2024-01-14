import { minMax, cloneJSON } from '../../ui';
import { chartConfig } from '../../../config/chart';
import drawColorBar from './drawColorBar';
import drawTitle from './drawTitle';
import drawImageByCover from './drawCoverPattern';
import drawImageByContain from './drawContainPattern';
// eslint-disable-next-line no-unused-vars
import drawZoom from './drawZoomTest2';
// eslint-disable-next-line no-unused-vars
import { drawOutlineTest, drawContainMB, drawCoverMB } from './drawMaterialBoundary';
// eslint-disable-next-line no-unused-vars
import { createDiv, append, createCanvas, getPos, getClickPointCoordinate, setupCanvas } from './help';
import { db } from '../../dataBase';

const cache = new Map<string, any>();

let equalW: number = 0;
let equalH: number = 0;
let equalOffsetX: number = 0;
let equalOffsetY: number = 0;

const clearCache = (cache: any, isCustom: boolean) => {
  if (cache.size > 5 || isCustom) {
    cache.clear();
  }
};

/**
 * @desc  绘制非均匀网格强度图
 * @param  data---强度数据
 * @param  dx---x轴方向，网格宽度数据
 * @param  dy---y轴方向，网格高度数据
 * @param  xSegNum---x轴切割份数
 * @param  ySegNum---y轴切割份数
 * @param  xName---x轴名称
 * @param  yName---y轴名称
 * @param  xData---x轴坐标数据
 * @param  yData---y轴坐标数据
 * @param  dom---dom
 * @param  cMin---自定义色带强度最弱颜色对应的强度值
 * @param  cMax---自定义色带强度最强颜色对应的强度值
 * @param  isCustomRange---是否开启数据缩放模式
 * @param  xMin---x轴坐标最小值
 * @param  xMax---x轴坐标最大值
 * @param  yMin---y轴坐标最小值
 * @param  yMax---y轴坐标最大值
 **/

export const intensityByCanvas = (para: any) => {
  const start = performance.now();
  const dom = para.dom;
  db.vChartDom = para.dom;
    console.log(dom, 8888888888);
  //   if (dom === null) return;
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild);
  }

  const resultType = para.resultType ?? '';

  const { data, dx, dy, title, xAxis, yAxis, customRange, equalScale, meshGrid, dividingLine, mbMatrix } = para.option.dataset;
  const { isCustomRange, xMin, xMax, yMin, yMax, cMin = null, cMax = null } = customRange ?? {};

  const pure = db.baseUnitDB.intensity;
  db.baseUnitDB.intensity.rangeX.min = xMin;
  db.baseUnitDB.intensity.rangeX.max = xMax;
  db.baseUnitDB.intensity.rangeY.min = yMin;
  db.baseUnitDB.intensity.rangeY.max = yMax;

  const xAxisPure = xAxis.pure ?? false;
  db.baseUnitDB.intensity.xAxisPure = xAxisPure;

  const yAxisPure = yAxis.pure ?? false;
  db.baseUnitDB.intensity.yAxisPure = yAxisPure;
  let fData, fDX, fDY, fXData, fYData, fMbMatrix;
  const isCustom = isCustomRange ?? false;
  const WIDTH = dom.clientWidth;
  const HEIGHT = dom.clientHeight;

  const xSegNum = dx.length >= 5 ? chartConfig.xAxis.seg : dx.length;
  const ySegNum = dy.length >= 5 ? chartConfig.yAxis.seg : dy.length;
  const Title = title?.text ? title?.text : '';
  const xName = xAxis?.name ? xAxis.name : '';
  const yName = yAxis?.name ? yAxis.name : '';
  const xData = xAxis.data;

  const yData = yAxis.data;
  const coverCacheKey = 'cover' + `${meshGrid}` + `${db.langName}` + `${WIDTH}` + `${HEIGHT}` + `${Title}` + `${isCustom}` + `${xName}` + `${yName}` + JSON.stringify(data);
  const containCacheKey = 'contain' + `${meshGrid}` + `${db.langName}` + `${WIDTH}` + `${HEIGHT}` + `${Title}` + `${isCustom}` + `${xName}` + `${yName}` + JSON.stringify(data);
  // const cadCacheKey = 'cad' + `${Title}` + JSON.stringify(data);
  // const coverCadCacheKey = 'cover' + 'cad' + `${Title}` + `${isCustom}` + `${xName}` + `${yName}` + JSON.stringify(mbMatrix);
  // const containCadCacheKey = 'contain' + 'cad' + `${Title}` + `${isCustom}` + `${xName}` + `${yName}` + JSON.stringify(mbMatrix);

  clearCache(cache, isCustom);

  if (isCustom && xMin !== undefined && xMax !== undefined && yMin !== undefined && yMax !== undefined) {
    const xMinIndex = xData.findIndex((x: number, index: number) => pure.x[index] >= xMin);
    let xMaxIndex = xData.findIndex((x: number, index: number) => pure.x[index] > xMax) - 1;
    if (xMaxIndex <= -1) {
      xMaxIndex = xData.length - 1;
    }
    const yMinIndex = yData.findIndex((y: number, index: number) => pure.y[index] >= yMin);
    let yMaxIndex = yData.findIndex((y: number, index: number) => pure.y[index] > yMax) - 1;
    if (yMaxIndex <= -1) {
      yMaxIndex = yData.length - 1;
    }

    fData = data.filter((arr: any, index: number) => index >= yMinIndex && index <= yMaxIndex).map((arr: any[]) => {
      return arr.filter((arr: any, index: number) => index >= xMinIndex && index <= xMaxIndex);
    });

    fDX = dx.filter((d: any, index: number) => index >= xMinIndex && index <= xMaxIndex);
    fDY = dy.filter((d: any, index: number) => index >= yMinIndex && index <= yMaxIndex);

    fXData = xData.filter((d: any, index: number) => index >= xMinIndex && index <= xMaxIndex);
    fYData = yData.filter((d: any, index: number) => index >= yMinIndex && index <= yMaxIndex);
    if (mbMatrix && mbMatrix.length > 0 && dividingLine) {
      fMbMatrix = mbMatrix.map((arr: number[], index: any) => [arr[0] - yMinIndex, arr[1] - xMinIndex]).filter((arr: number[], index: any) => arr[0] <= yMaxIndex && arr[1] <= xMaxIndex && arr[0] >= 0 && arr[1] >= 0);
    } else {
      fMbMatrix = [];
    }
  } else {
    fData = data;
    fDX = dx;
    fDY = dy;
    fXData = xData;
    fYData = yData;
    fMbMatrix = mbMatrix || [];
  }
  db.viewData.image.data = cloneJSON(fData);
  db.viewData.image.x = fXData;
  db.viewData.image.y = fYData;
  if (resultType && resultType === 'emeSMATRIX' || resultType === 'FDTDSMatrixIntensity' || resultType === 'emeParamsSWEEP_Image') {
    // fData = fData.reverse();
    const reverse = [];
    for (let i = fData.length - 1; i >= 0; i--) {
      reverse.push(fData[i]);
    }
    fData = reverse;
  }

  const axes = { xName, yName, xSegNum, ySegNum, fXData, fYData, xMin, xMax, yMin, yMax };

  const xT = fDX.reduce((a: number, c: number) => a + c, 0);
  const yT = fDY.reduce((a: number, c: number) => a + c, 0);

  const dataMaxs = [];
  const dataMins = [];

  for (let i = 0; i < fData.length; i++) {
    const [min, max] = minMax(fData[i]);
    dataMaxs.push(max);
    dataMins.push(min);
  }

  const dataMax = minMax(dataMaxs)[1];
  const dataMin = minMax(dataMins)[0];

  const colorMin = cMin !== null ? cMin : dataMin;
  const colorMax = cMax !== null ? cMax : dataMax;

  const { yW, cW, xH, tH } = getPos(HEIGHT, WIDTH);

  const coverDiv = createDiv(HEIGHT, WIDTH);
  const containDiv = createDiv(HEIGHT, WIDTH, 9);
  const cadDiv = createDiv(HEIGHT, WIDTH, 99);
  const cover = createCanvas(HEIGHT, WIDTH);
  const contain = createCanvas(HEIGHT, WIDTH);
  const cad = createCanvas(HEIGHT, WIDTH);
  const coverCtx: CanvasRenderingContext2D = cover.ctx;
  const containCtx: CanvasRenderingContext2D = contain.ctx;
  const cadCtx: CanvasRenderingContext2D = cad.ctx;

  coverCtx.translate(yW, tH);
  containCtx.translate(yW, tH);

  const W = WIDTH - yW - cW;
  const H = HEIGHT - xH - tH;
  // TEST ZOOM FUNC
  //   const zoomTestDiv = createDiv(H, W, 100);
  //   //   zoomTestDiv.style.border = '2px solid orange';
  //   zoomTestDiv.style.marginTop = `${tH}px`;
  //   zoomTestDiv.style.marginLeft = `${yW}px`;
  //   const zoom = createCanvas(H, W);
  //   const zoomCtx: CanvasRenderingContext2D = zoom.ctx;
  //   const zoomCanvas: HTMLCanvasElement = zoom.canvas;
  //   drawZoom(zoomTestDiv, zoomCtx, zoomCanvas, W, H, yW, tH);

  // TTTTTTTT  框线 TTTTTTTTTTTTT
  // drawOutlineTest(cadCtx, WIDTH, HEIGHT, W, H, fData, fDX, fDY, xT, yT, dataMin, dataMax, colorMin, colorMax, mbMatrix)
  // var start2 = performance.now();
  // console.log('绘制 强度图 之前 耗时：' + (start2 - start1) + '毫秒。');

  if (equalScale) {
    if (cache.has(containCacheKey) && !isCustom) {
      contain.canvas = cache.get(containCacheKey).layer;
      const equal = cache.get(containCacheKey).equal;
      equalW = equal.containW;
      equalH = equal.containH;
      equalOffsetX = equal.offsetX;
      equalOffsetY = equal.offsetY;
    //   console.log('contain use cache');
    } else {
      const { containW, containH, offsetX, offsetY } = drawImageByContain(containCtx, W, H, fData, fDX, fDY, xT, yT, dataMin, dataMax, colorMin, colorMax, axes, fMbMatrix, resultType, meshGrid);
      equalW = containW;
      equalH = containH;
      equalOffsetX = offsetX;
      equalOffsetY = offsetY;
      cache.set(containCacheKey, { layer: contain.canvas, equal: { containW, containH, offsetX, offsetY }});
    }

    // if (cache.has(containCadCacheKey)) {
    //     cad.canvas = cache.get(containCadCacheKey).layer
    //     console.log('cad 使用缓存canvas 没用重绘 contain');
    // } else {
    //
    drawContainMB(cadCtx, WIDTH, HEIGHT, W, H, yW, tH, fData, fDX, fDY, xT, yT, dataMin, dataMax, colorMin, colorMax, dividingLine, fMbMatrix, equalW, equalH, equalOffsetX, equalOffsetY);
    // cache.set(containCadCacheKey, { layer: cad.canvas });
    // }
  } else {
    if (cache.has(coverCacheKey) && !isCustom) {
      cover.canvas = cache.get(coverCacheKey).layer;
    //   console.log('cover use cache');
    } else {
      drawImageByCover(coverCtx, W, H, fData, fDX, fDY, xT, yT, dataMin, dataMax, colorMin, colorMax, axes, fMbMatrix, resultType, meshGrid);
      cache.set(coverCacheKey, { layer: cover.canvas });
    }

    // if (cache.has(coverCadCacheKey)) {
    //     cad.canvas = cache.get(coverCadCacheKey).layer
    //     console.log('cad 使用缓存canvas 没用重绘 cover!!!');
    // } else {

    drawCoverMB(cadCtx, WIDTH, HEIGHT, W, H, yW, tH, fData, fDX, fDY, xT, yT, dataMin, dataMax, colorMin, colorMax, dividingLine, fMbMatrix);
    //     cache.set(coverCadCacheKey, { layer: cad.canvas });
    // }
  }
  // var start3 = performance.now()
  // console.log('单单 绘制 强度图 耗时：' + (start3 - start2) + '毫秒。');

  drawColorBar(coverCtx, H, W, 767, 15, colorMax, colorMin);
  drawTitle(coverCtx, Title, W, H, tH);

  // var start4 = performance.now()
  // console.log('绘制 色带 标题 耗时：' + (start4 - start3) + '毫秒。');
  append(dom, coverDiv, cover.canvas);
  append(dom, containDiv, contain.canvas);
  append(dom, cadDiv, cad.canvas);

  //   append(dom, zoomTestDiv, zoom.canvas);

  // getClickPointCoordinate(dom); // TEST
  const end = performance.now();
    console.log('performance canvas绘制完成:', end);
  db.pTime = end - start;
  //   console.log('绘制全部耗时：' + db.pTime + '毫秒。');
  if (db.rAFID) {
    cancelAnimationFrame(db.rAFID);
  }
  if (!db.startRAF) {
    if (db.rAFID) {
      cancelAnimationFrame(db.rAFID);
    }
    return;
  }

  db.rAFID = requestAnimationFrame(() => { intensityByCanvas(para); });
};

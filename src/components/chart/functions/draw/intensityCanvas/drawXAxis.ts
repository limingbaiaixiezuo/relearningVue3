
import { calcF, getAxesMarkerLabel, toMaxSN, isEqual, drawHorizontalLine, drawVerticalLine } from './help';
import { getPortInfo } from '../../../config/chart';
import { db } from '../../dataBase';
import { isSpecialUnit, calcXAxisNum } from '../../utils';
import { LangF } from '../lib';

/**
 * @desc  绘制X轴及其标识；左上角开始绘制
 * @param  ctx---canvas 实例
 * @param  H---canvas 长度
 * @param  W---canvas 宽度
 * @param  markerH---间隔标识的高度
 * @param  markerNum---坐标轴分成几段
 * @param  xName---Y轴的名字
 * @param  xData---x轴应该显示的数据
 * @param  yData---y轴应该显示的数据
 **/

const drawXAxis = (type: string, ctx: CanvasRenderingContext2D, xName: string, H: number, W: number, markerH: number, markerNum: number, xData: any, yData: any, xMin: any, xMax: any, yMin: any, yMax: any, containW: number, containH: number, resultType: string) => {
  if (resultType === 'emeSMATRIX' || resultType === 'FDTDSMatrixIntensity' || resultType === 'emeParamsSWEEP_Image') {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#303133';
    ctx.lineWidth = 1;
    drawHorizontalLine(ctx, 0, -7, W + 1);
    if (getPortInfo.num <= 15) {
      drawSMatrixXMarkerByPortNum(getPortInfo.num, type, ctx, H + 2, W, markerH, containW);
    }
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#303133';
    ctx.lineWidth = 0.5;
    drawHorizontalLine(ctx, H, -7, W + 1);
    if (type === 'cover') {
      drawCoverXMarker(ctx, H + 1, W, xName, markerH, markerNum, xData, yData, xMin, xMax, yMin, yMax);
    }
    if (type === 'contain') {
      drawContainXMarker(ctx, H + 1, W, xName, markerH, markerNum, xData, yData, xMin, xMax, yMin, yMax, containW, containH);
    }
  }
};

const drawContainXMarker = (ctx: CanvasRenderingContext2D, H: number, W: number, xName: string, markerH: number, markerNum: number, xData: any, yData: any, xMin: any, xMax: any, yMin: any, yMax: any, containW: number, containH: number) => {
  const F = calcF(8, W, H);
  ctx.font = `${(F)}px Arial`;
  let horX = W / 2 - containW / 2;
  let containSegNum = calcXAxisNum(containW, xData.length);
  if (containW <= 100) { containSegNum = 1; }

  if (db.baseUnitDB.intensity.xAxisPure) {
    const pureX = db.viewData.image.pureX;
    containSegNum = pureX.length;
  }
  const interval = Math.floor((containW + containSegNum) / (containSegNum - 1));
  const xLabels = db.baseUnitDB.intensity.xAxisPure ? db.viewData.image.pureX : getAxesMarkerLabel(containSegNum, xData, yData, xMin, xMax, yMin, yMax).x;

  const xLabelsLens = xLabels.map((x: any) => ctx.measureText(x).width);
  if (Math.max(...xLabelsLens) * containSegNum > W || isEqual(xLabels) || containSegNum === 1 && !db.baseUnitDB.intensity.xAxisPure) {
    drawOnlyOneMarker(ctx, xName, W, H, markerH, markerNum, xData, yData, xMin, xMax, yMin, yMax, isEqual(xLabels), F);
  } else {
    for (let i = 0; i < containSegNum; i++) {
      if (i + 1 === containSegNum) {
        drawVerticalLine(ctx, W / 2 + containW / 2, H, H + markerH);
      } else if (i !== 0 && i !== containSegNum || containW < W && i !== containSegNum) {
        drawVerticalLine(ctx, horX, H, H + markerH);
      }
      ctx.fillText(xLabels[i], horX - ctx.measureText(xLabels[i]).width / 2, H + markerH + F);
      horX += interval;
    }

    const xOrder = getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).xOrder;
    drawXName(ctx, W, H, xName, markerH, xOrder);
  }
  ctx.stroke();
  ctx.closePath();
};

const drawCoverXMarker = (ctx: CanvasRenderingContext2D, H: number, W: number, xName: string, markerH: number, markerNum: number, xData: any, yData: any, xMin: any, xMax: any, yMin: any, yMax: any) => {
  const F = calcF(8, W, H);
  ctx.font = `${(F)}px Arial`;
  ctx.font = `${calcF(8, W, H)}px Arial`;
  let horX = 0;
  markerNum = calcXAxisNum(W, xData.length);
  if (db.baseUnitDB.intensity.xAxisPure) {
    const pureX = db.viewData.image.pureX;
    markerNum = pureX.length;
    if (markerNum < 1) {
      markerNum = 1;
    }
  }
  const interval = Math.floor((W + markerNum - 1) / (markerNum - 1));
  const xLabels = db.baseUnitDB.intensity.xAxisPure ? db.viewData.image.pureX : getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).x;

  const xLabelsLens = xLabels.map((x: any) => ctx.measureText(x).width);

  if (Math.max(...xLabelsLens) * markerNum > W || isEqual(xLabels)) {
    drawOnlyOneMarker(ctx, xName, W, H, markerH, markerNum, xData, yData, xMin, xMax, yMin, yMax, isEqual(xLabels), F);
  } else {
    for (let i = 0; i < markerNum; i++) {
      if (i + 1 === markerNum) {
        drawVerticalLine(ctx, W, H, H + markerH);
      } else if (i !== 0 && i !== markerNum) {
        drawVerticalLine(ctx, horX, H, H + markerH);
      }
      ctx.fillText(xLabels[i], horX - ctx.measureText(xLabels[i]).width / 2, H + markerH + F);
      horX += interval;
    }
    const xOrder = getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).xOrder;
    drawXName(ctx, W, H, xName, markerH, xOrder);
  }
  ctx.stroke();
  ctx.closePath();
};

const drawOnlyOneMarker = (ctx: CanvasRenderingContext2D, xName: string, W: number, H: number, markerH: number, markerNum: number, xData: number[], yData: number[], xMin: number, xMax: number, yMin: number, yMax: number, isEqualLabels: boolean, F: number) => {
  drawVerticalLine(ctx, W / 2, H, H + markerH);
  let str = '';
  if (db.baseUnitDB.intensity.xAxisPure) {
    str = `${db.viewData.image.pureX[0]}`;
  } else {
    str = xMax - xMin === 0 ? `${toMaxSN([xMax]).label[0]}` : `${toMaxSN([(xMax - xMin) / 2 + xMin]).label[0]}`;
  }

  ctx.fillText(str, W / 2 - ctx.measureText(str).width / 2, H + markerH + F);

  const xOrder = getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).xOrder;
  drawXName(ctx, W, H, xName, markerH, xOrder);
};

const drawSMatrixXMarkerByPortNum = (markerNum: number, type: string, ctx: CanvasRenderingContext2D, H: number, W: number, markerH: number, containW: number) => {
  if (type === 'cover') {
    coverPortXMarker(markerNum, ctx, H, W, markerH);
  }
  if (type === 'contain') {
    containPortXMarker(markerNum, ctx, H, W, markerH, containW);
  }
};

const drawXName = (ctx: CanvasRenderingContext2D, W: number, H: number, xName: string, markerH: number, xOrder: number) => {
  const F = calcF(9, W, H);
  ctx.font = `${F}px Arial`;
  const strWidth = ctx.measureText(xName).width;
  let axesTitle = '';

  if (xName === '') {
    axesTitle = Math.abs(xOrder) > 1 ? `(x10^${xOrder})` : Number(xOrder) === 1 ? '(x10)' : Number(xOrder) === -1 ? '(x10^-1)' : '';
  } else if (isSpecialUnit(xName)) {
    axesTitle = Math.abs(xOrder) > 1 ? `${LangF(xName)} (x10^${xOrder})` : Number(xOrder) === 1 ? `${LangF(xName)} (x10)` : Number(xOrder) === -1 ? `${LangF(xName)} (x10^-1)` : `${LangF(xName)}`;
  } else {
    const name = xName.slice(0, xName.length - 1);
    axesTitle = Math.abs(xOrder) > 1 ? `${LangF(name)} x10^${xOrder})` : Number(xOrder) === 1 ? `${LangF(name)} x10)` : Number(xOrder) === -1 ? `${LangF(name)} x10^-1)` : `${LangF(name)})`;
  }

  if (xName === 'Mode' || xName === 'mode' || xName.slice(0, 5) === 'Sweep' || xName.slice(0, 5) === 'sweep') {
    axesTitle = `${LangF(xName)}`;
  }

  ctx.fillText(axesTitle, W / 2 - strWidth / 2, H + markerH + F + 20);
  ctx.stroke();
  ctx.closePath();
};

const containPortXMarker = (markerNum: number, ctx: CanvasRenderingContext2D, H: number, W: number, markerH: number, containW: number) => {
  const F = calcF(8, W, H);
  ctx.font = `${(F)}px Arial`;
  const horX = W / 2 - containW / 2 + containW / markerNum / 2;
  for (let i = 0; i < markerNum; i++) {
    drawVerticalLine(ctx, horX + i * (containW / markerNum), 0, -markerH);
    ctx.fillText(`${i + 1}`, horX - ctx.measureText(`${markerNum}`).width / 2 + i * (containW / markerNum), -F + 2);
  }
  ctx.stroke();
  ctx.closePath();
};

const coverPortXMarker = (markerNum: number, ctx: CanvasRenderingContext2D, H: number, W: number, markerH: number) => {
  const F = calcF(8, W, H);
  ctx.font = `${(F)}px Arial`;
  const horX = W / markerNum / 2;
  for (let i = 0; i < markerNum; i++) {
    drawVerticalLine(ctx, horX + i * (W / markerNum), 0, -markerH);
    ctx.fillText(`${i + 1}`, horX - ctx.measureText(`${markerNum}`).width / 2 + i * (W / markerNum), -F + 2);
  }
  ctx.stroke();
  ctx.closePath();
};

export default drawXAxis;

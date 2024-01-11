import { minMax } from '../../ui';
import { calcF, getAxesMarkerLabel, toMaxSN, isEqual, drawHorizontalLine, drawVerticalLine } from './help';
import { getPortInfo } from '../../../config/chart';
import { db } from '../../dataBase';
import { isSpecialUnit, calcYAxisNum } from '../../utils';
import { LangF } from '../lib';

/**
 * @desc  绘制Y轴及其标识；左上角开始绘制
 * @param  ctx---canvas 实例
 * @param  H---canvas 长度
 * @param  markerW---间隔标识的长度
 * @param  markerNum---坐标轴分成几段
 * @param  yName---y轴的名字
 * @param  xData---x轴应该显示的数据
 * @param  yData---y轴应该显示的数据
 **/

const drawYAxis = (type: string, ctx: CanvasRenderingContext2D, yName: string, H: number, W: number, markerW: number, markerNum: number, xData: any, yData: any, xMin: any, xMax: any, yMin: any, yMax: any, containW: number, containH: number, resultType: string) => {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#303133';
  ctx.lineWidth = 1;

  if (resultType === 'emeSMATRIX' || resultType === 'FDTDSMatrixIntensity' || resultType === 'emeParamsSWEEP_Image') {
    drawVerticalLine(ctx, -1, -5, H + 2);
    if (getPortInfo.num <= 15) {
      drawSMatrixYMarkerByPortNum(getPortInfo.num, type, ctx, H + 2, W, containH, markerW);
    }
  } else {
    drawVerticalLine(ctx, -1, 0, H + 7);
    if (type === 'cover') {
      drawCoverYMarker(ctx, W, H, yName, markerW, markerNum, xData, yData, xMin, xMax, yMin, yMax);
    }

    if (type === 'contain') {
      drawContainYMarker(ctx, W, H, yName, markerW, markerNum, xData, yData, xMin, xMax, yMin, yMax, containW, containH);
    }
  }
};

const drawContainYMarker = (ctx: CanvasRenderingContext2D, W: number, H: number, yName: string, markerW: number, markerNum: number, xData: any[], yData: any[], xMin: number, xMax: number, yMin: number, yMax: number, containW: number, containH: number) => {
  const F = calcF(8, W, H);
  ctx.font = `${(F)}px Arial`;

  let verY = H / 2 - containH / 2 + 1;
  let containSegNum = calcYAxisNum(containH, yData.length);
  if (containH <= 100) { containSegNum = 1; }
  if (db.baseUnitDB.intensity.yAxisPure) {
    const pureY = db.viewData.image.pureY;
    containSegNum = pureY.length;
    if (containSegNum < 1) {
      containSegNum = 1;
    }
  }
  const interval = Math.floor((containH + containSegNum - 1) / (containSegNum - 1));
  const yLabels = db.baseUnitDB.intensity.yAxisPure ? db.viewData.image.pureY : getAxesMarkerLabel(containSegNum, xData, yData, xMin, xMax, yMin, yMax).y.reverse();

  if (isEqual(yLabels) || containSegNum === 1 && !db.baseUnitDB.intensity.yAxisPure) {
    drawOnlyOneMarker(ctx, yName, W, H, markerW, markerNum, xData, yData, xMin, xMax, yMin, yMax, isEqual(yLabels), F);
  } else {
    for (let i = 0; i < containSegNum; i++) {
      if (i + 1 === containSegNum && containH <= H) {
        drawHorizontalLine(ctx, H / 2 - containH / 2 + 1, -1, -markerW - 1);
      } else if (i === 0 && containH < H) {
        drawHorizontalLine(ctx, H / 2 + containH / 2, -1, -markerW - 1);
      } else if (i !== 0 && i !== containSegNum || containH < H && i !== containSegNum) {
        drawHorizontalLine(ctx, verY, -1, -markerW - 1);
      }

      if (i + 1 === markerNum) {
        ctx.fillText(`${yLabels[i]}`, -markerW - ctx.measureText(`${yLabels[i]}`).width - 4, verY + (F - 20) / 2);
      } else {
        ctx.fillText(`${yLabels[i]}`, -markerW - ctx.measureText(`${yLabels[i]}`).width - 4, verY + (F - 4) / 2);
      }

      verY += interval;
    }
    const yOrder = getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).yOrder;
    drawYName(ctx, W, H, yName, markerNum, xData, yData, xMin, xMax, yMin, yMax, yOrder);
  }
  ctx.stroke();
  ctx.closePath();
};

const drawCoverYMarker = (ctx: CanvasRenderingContext2D, W: number, H: number, yName: string, markerW: number, markerNum: number, xData: any[], yData: any[], xMin: number, xMax: number, yMin: number, yMax: number) => {
  const F = calcF(8, W, H);
  ctx.font = `${(F)}px Arial`;
  let verY = 1;
  markerNum = calcYAxisNum(H, yData.length);
  if (db.baseUnitDB.intensity.yAxisPure) {
    const pureY = db.viewData.image.pureY;
    markerNum = pureY.length;
    if (markerNum < 1) {
      markerNum = 1;
    }
  }
  const interval = Math.floor((H + markerNum - 1) / (markerNum - 1));

  const yLabels = db.baseUnitDB.intensity.yAxisPure ? db.viewData.image.pureY : getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).y.reverse();

  if (isEqual(yLabels)) {
    drawOnlyOneMarker(ctx, yName, W, H, markerW, markerNum, xData, yData, xMin, xMax, yMin, yMax, isEqual(yLabels), F);
  } else {
    for (let i = 0; i < markerNum; i++) {
      if (i + 1 === markerNum) {
        drawHorizontalLine(ctx, 0, -1, -markerW - 1);
      } else if (i !== 0 && i !== markerNum) {
        drawHorizontalLine(ctx, verY, -1, -markerW - 1);
      }

      if (i + 1 === markerNum) {
        ctx.fillText(`${yLabels[i]}`, -markerW - ctx.measureText(`${yLabels[i]}`).width - 4, verY + (F - 20) / 2);
      } else {
        ctx.fillText(`${yLabels[i]}`, -markerW - ctx.measureText(`${yLabels[i]}`).width - 4, verY + (F - 4) / 2);
      }

      verY += interval;
    }
    const yOrder = getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).yOrder;
    drawYName(ctx, W, H, yName, markerNum, xData, yData, xMin, xMax, yMin, yMax, yOrder);
  }
  ctx.stroke();
  ctx.closePath();
};

const drawOnlyOneMarker = (ctx: CanvasRenderingContext2D, yName: string, W: number, H: number, markerW: number, markerNum: number, xData: Array<number>, yData: Array<number>, xMin: number, xMax: number, yMin: number, yMax: number, isEqualLabels: boolean, F: number) => {
  drawHorizontalLine(ctx, H / 2, -1, -markerW - 1);
  let str = '';
  if (db.baseUnitDB.intensity.yAxisPure) {
    str = `${db.viewData.image.pureY[0]}`;
  } else {
    str = yMax - yMin === 0 ? `${toMaxSN([yMax]).label[0]}` : `${toMaxSN([(yMax - yMin) / 2 + yMin]).label[0]}`;
  }

  ctx.fillText(str, -markerW - ctx.measureText(str).width - 4, H / 2 + (F - 4) / 2);
  const yOrder = getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).yOrder;
  drawYName(ctx, W, H, yName, markerNum, xData, yData, xMin, xMax, yMin, yMax, yOrder);
};

const drawYName = (ctx: CanvasRenderingContext2D, W: number, H: number, yName: any, markerNum: number, xData: any[], yData: any[], xMin: number, xMax: number, yMin: number, yMax: number, yOrder: number) => {
  ctx.save();
  ctx.font = `${calcF(9, W, H)}px Arial`;
  const yLabels = getAxesMarkerLabel(markerNum, xData, yData, xMin, xMax, yMin, yMax).y.reverse();
  const longestYlabel = minMax(yLabels.map((y: any) => ctx.measureText(y).width))[1];
  const strWidth = ctx.measureText(yName).width;

  let translateOffsetX = -longestYlabel - 10;
  if (translateOffsetX > -40) {
    translateOffsetX = -40;
  }
  if (translateOffsetX < -48) {
    translateOffsetX = -48;
  }

  ctx.translate(translateOffsetX, H / 2 + strWidth / 2);
  ctx.rotate(-90 * Math.PI / 180);
  ctx.translate(0, translateOffsetX);

  let axesTitle = '';
  if (yName === '') {
    axesTitle = Math.abs(yOrder) > 1 ? `(x10^${yOrder})` : Number(yOrder) === 1 ? '(x10)' : Number(yOrder) === -1 ? '(x10^-1)' : '';
  } else if (isSpecialUnit(yName)) {
    axesTitle = Math.abs(yOrder) > 1 ? `${LangF(yName)} (x10^${yOrder})` : Number(yOrder) === 1 ? `${LangF(yName)} (x10)` : Number(yOrder) === -1 ? `${LangF(yName)} (x10^-1)` : `${LangF(yName)}`;
  } else {
    const name = yName.slice(0, yName.length - 1);
    axesTitle = Math.abs(yOrder) > 1 ? `${LangF(name)} x10^${yOrder})` : Number(yOrder) === 1 ? `${LangF(name)} x10)` : Number(yOrder) === -1 ? `${LangF(name)} x10^-1)` : `${LangF(name)})`;
  }

  if (yName === 'Mode' || yName === 'mode' || yName.slice(0, 5) === 'Sweep' || yName.slice(0, 5) === 'sweep') {
    axesTitle = `${LangF(yName)}`;
  }

  ctx.fillText(axesTitle, 0, 10 + W / 50);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

const drawSMatrixYMarkerByPortNum = (markerNum: number, type: string, ctx: CanvasRenderingContext2D, H: number, W: number, containH: number, markerW: number) => {
  const F = calcF(8, W, H);
  ctx.font = `${(F)}px Arial`;
  if (type === 'cover') {
    coverPortYMarker(ctx, H, markerNum, markerW);
  }
  if (type === 'contain') {
    containPortYMarker(ctx, H, markerNum, containH, markerW);
  }
};

const containPortYMarker = (ctx: CanvasRenderingContext2D, H: number, markerNum: number, containH: number, markerW: number) => {
  const verY = H / 2 - containH / 2 - containH / markerNum / 2;
  for (let i = markerNum; i > 0; i--) {
    drawHorizontalLine(ctx, verY + (containH / markerNum) * i, -1, -markerW - 1);
    ctx.fillText(`${i}`, -markerW - ctx.measureText(`${markerNum}`).width - 4, verY + (containH / markerNum) * i + 3);
  }
  ctx.stroke();
  ctx.closePath();
};

const coverPortYMarker = (ctx: CanvasRenderingContext2D, H: number, markerNum: number, markerW: number) => {
  const verY = H / 2 - H / 2 - H / markerNum / 2;
  for (let i = markerNum; i > 0; i--) {
    drawHorizontalLine(ctx, verY + (H / markerNum) * i, -1, -markerW - 1);
    ctx.fillText(`${i}`, -markerW - ctx.measureText(`${markerNum}`).width - 4, verY + (H / markerNum) * i + 3);
  }
  ctx.stroke();
  ctx.closePath();
};

export default drawYAxis;

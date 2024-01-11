import { drawRect } from './help';
import drawYAxis from './drawYAxis';
import drawXAxis from './drawXAxis';

type matrix = Array<Array<number>>

// 按照物理尺寸等比绘制
/**
 * Draw the intensity of the image in the form of a rectangle according to the value of the data
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} W - the width of the canvas
 * @param {number} H - height of the canvas
 * @param {matrix} fData - the data to be drawn
 * @param {number[]} fDX - the width of each bar
 * @param {number[]} fDY - the height of each bar
 * @param {number} xT - the width of the canvas
 * @param {number} yT - the height of the y axis
 * @param {number} dataMin - the minimum value of the data
 * @param {number} dataMax - the maximum value of the data
 * @param {number} cMin - the minimum value of the color scale
 * @param {number} cMax - the maximum value of the color scale
 * @param axes - { xName?: any; yName: any; xSegNum?: any; ySegNum: any; fXData: any; fYData: any;
 * xMin: any; xMax: any; yMin: any; yMax: any; },
 * @param {matrix} mbMatrix - the matrix of the image
 * @param {string} resultType - "contain" or "cover"
 * @returns The return value is a dictionary with the following keys:
 */
const drawImageByContain = (ctx: CanvasRenderingContext2D, W: number, H: number, fData: matrix, fDX: number[], fDY: number[], xT: number, yT: number, dataMin: number, dataMax: number, cMin: number, cMax: number, axes: { xName?: any; yName: any; xSegNum?: any; ySegNum: any; fXData: any; fYData: any; xMin: any; xMax: any; yMin: any; yMax: any; }, mbMatrix: matrix, resultType: string, meshGrid: boolean) => {
  let x;
  let y;
  let w_;
  let h_;
  let cX;
  const l = fData.length;
  let L;
  let i;
  let j;
  let cY = yT;

  let containW = W;
  let containH = H;
  let offsetX = 0;
  let offsetY = 0;
  // var start1 = performance.now();
  for (i = 0; i < l; i = i + 1) {
    cX = 0;
    L = fData[i].length;
    if (W / xT > H / yT) {
      const phyRatio = xT / yT;
      const phyH = H;
      const phyW = phyH * phyRatio;

      offsetY = H / 2 - phyH / 2;
      offsetX = W / 2 - phyW / 2;
      for (j = 0; j < L; j = j + 1) {
        w_ = fDX[j] / xT * phyW;
        h_ = fDY[i] / yT * phyH;
        x = cX / xT * phyW + offsetX;
        y = cY / yT * phyH - h_ + offsetY;

        drawRect(ctx, x, y, w_, h_, fData, i, j, dataMin, dataMax, cMin, cMax, mbMatrix, { meshGrid, rowLen: l - 1, colLen: L - 1, rowIndex: i, colIndex: j });

        cX += fDX[j];
      }
      containH = phyH;
      containW = phyW;
    } else if (W / xT < H / yT) {
      const phyRatio = yT / xT;
      const phyW = W;
      const phyH = phyW * phyRatio;
      offsetX = W / 2 - phyW / 2;
      offsetY = H / 2 - phyH / 2;
      for (j = 0; j < L; j = j + 1) {
        w_ = fDX[j] / xT * phyW;
        h_ = fDY[i] / yT * phyH;
        x = cX / xT * phyW + offsetX;
        y = cY / yT * phyH - h_ + offsetY;

        drawRect(ctx, x, y, w_, h_, fData, i, j, dataMin, dataMax, cMin, cMax, mbMatrix, { meshGrid, rowLen: l - 1, colLen: L - 1, rowIndex: i, colIndex: j });

        cX += fDX[j];
      }
      containW = phyW;
      containH = phyH;
    } else {
      if (W < H) {
        offsetY = (H - W) / 2;
        for (j = 0; j < L; j = j + 1) {
          w_ = fDX[j] / xT * W;
          h_ = fDY[i] / yT * W;
          x = cX / xT * W;
          y = cY / yT * W - h_ + offsetY;

          drawRect(ctx, x, y, w_, h_, fData, i, j, dataMin, dataMax, cMin, cMax, mbMatrix, { meshGrid, rowLen: l - 1, colLen: L - 1, rowIndex: i, colIndex: j });

          cX += fDX[j];
        }
        containH = W;
      } else {
        offsetX = (W - H) / 2;
        for (j = 0; j < L; j = j + 1) {
          w_ = fDX[j] / xT * H;
          h_ = fDY[i] / yT * H;
          x = cX / xT * H + offsetX;
          y = cY / yT * H - h_;

          drawRect(ctx, x, y, w_, h_, fData, i, j, dataMin, dataMax, cMin, cMax, mbMatrix, { meshGrid, rowLen: l - 1, colLen: L - 1, rowIndex: i, colIndex: j });

          cX += fDX[j];
        }
        containW = H;
      }
    }

    cY -= fDY[i];
  }

  ctx.save();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgba(60, 60, 60, 0.55)';
  ctx.stroke();
  ctx.restore();
  // var start2 = performance.now();
  // console.log('等比绘制 强度点 耗时：' + (start2 - start1) + '毫秒。');
  drawYAxis('contain', ctx, axes.yName, H, W, 5, axes.ySegNum, axes.fXData, axes.fYData, axes.xMin, axes.xMax, axes.yMin, axes.yMax, containW, containH, resultType);
  drawXAxis('contain', ctx, axes.xName, H, W, 5, axes.xSegNum, axes.fXData, axes.fYData, axes.xMin, axes.xMax, axes.yMin, axes.yMax, containW, containH, resultType);
  // var end = performance.now();
  // console.log('等比绘制 坐标轴 耗时：' + (end - start2) + '毫秒。');
  // console.log('等比绘制耗时：' + (end - start1) + '毫秒。');
  return { containW, containH, offsetX, offsetY };
};

export default drawImageByContain;

import drawYAxis from './drawYAxis';
import drawXAxis from './drawXAxis';
import { drawRect } from './help';

// 按容器比例绘制
/**
 * Draw the image by cover
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} W - the width of the canvas
 * @param {number} H - height of the canvas
 * @param {matrix} fData - the data matrix
 * @param {number[]} fDX - the width of each column
 * @param {number[]} fDY - the height of each segment
 * @param {number} xT - the width of the canvas
 * @param {number} yT - the height of the canvas
 * @param {number} dataMin - the minimum value of the data
 * @param {number} dataMax - the maximum value of the data
 * @param {number} cMin - the minimum value of the color scale
 * @param {number} cMax - the maximum value of the color scale
 * @param axes - { xName: any; yName: any; xSegNum: any; ySegNum: any; fXData: any; fYData: any; xMin:
 * @param {matrix} mbMatrix - matrix
 * @param {string} resultType - "cover" or "contour"
 */

type matrix = Array<Array<number>>

const drawImageByCover = (ctx: CanvasRenderingContext2D, W: number, H: number, fData: matrix, fDX: number[], fDY: number[], xT: number, yT: number, dataMin: number, dataMax: number, cMin: number, cMax: number, axes: { xName: any; yName: any; xSegNum: any; ySegNum: any; fXData: any; fYData: any; xMin: any; xMax: any; yMin: any; yMax: any; }, mbMatrix: matrix, resultType: string, meshGrid: boolean) => {
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

  const containW = W;
  const containH = H;
  for (i = 0; i < l; i = i + 1) {
    cX = 0;
    L = fData[i].length;
    for (j = 0; j < L; j = j + 1) {
      w_ = fDX[j] / xT * W;
      h_ = fDY[i] / yT * H;
      x = cX / xT * W;
      y = cY / yT * H - h_;

      drawRect(ctx, x, y, w_, h_, fData, i, j, dataMin, dataMax, cMin, cMax, mbMatrix, { meshGrid, rowLen: l - 1, colLen: L - 1, rowIndex: i, colIndex: j });

      cX += fDX[j];
    }
    cY -= fDY[i];
  }
  ctx.save();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgba(60, 60, 60, 0.55)';
  ctx.stroke();
  ctx.restore();
  drawYAxis('cover', ctx, axes.yName, H, W, 5, axes.ySegNum, axes.fXData, axes.fYData, axes.xMin, axes.xMax, axes.yMin, axes.yMax, containW, containH, resultType);
  drawXAxis('cover', ctx, axes.xName, H, W, 5, axes.xSegNum, axes.fXData, axes.fYData, axes.xMin, axes.xMax, axes.yMin, axes.yMax, containW, containH, resultType);
};

export default drawImageByCover;

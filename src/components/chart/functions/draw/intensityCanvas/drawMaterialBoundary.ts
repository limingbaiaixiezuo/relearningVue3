
type MATRIX = Array<Array<number>>

/**
 * Draws the outline of the matrix
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} WIDTH - the width of the canvas
 * @param {number} HEIGHT - the height of the canvas
 * @param {number} W - width of the image
 * @param {number} H - height of the image
 * @param {MATRIX} fData - The data matrix
 * @param {number[]} fDX - the x-coordinates of the data points
 * @param {number[]} fDY - The y-coordinates of the data points.
 * @param {number} xT - the x-coordinate of the top-left corner of the matrix
 * @param {number} yT - The y-coordinate of the top of the graph.
 * @param {number} dataMin - the minimum value of the data
 * @param {number} dataMax - the maximum value of the data
 * @param {number} cMin - the minimum value of the color scale
 * @param {number} cMax - The maximum value of the color scale.
 * @param {MATRIX} fMbMatrix - The matrix of the function to be drawn.
 */
const drawOutlineTest = (ctx: CanvasRenderingContext2D, WIDTH: number, HEIGHT: number, W: number, H: number, fData: MATRIX, fDX: number[], fDY: number[], xT: number, yT: number, dataMin: number, dataMax: number, cMin: number, cMax: number, fMbMatrix: MATRIX) => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'yellow';
  ctx.strokeRect(1, 1, WIDTH - 2, HEIGHT - 2);
  ctx.closePath();
  ctx.beginPath();
};

/**
 * Draw the MB of the current frame
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} WIDTH - the width of the canvas
 * @param {number} HEIGHT - the height of the canvas
 * @param {number} W - the width of the canvas
 * @param {number} H - height of the canvas
 * @param {number} yW - the width of the y axis
 * @param {number} tH - the height of the top margin
 * @param {MATRIX} fData - The data matrix.
 * @param {number[]} fDX - the x-coordinates of the feature
 * @param {number[]} fDY - the height of the frame
 * @param {number} xT - the x coordinate of the top left corner of the chart
 * @param {number} yT - the y-coordinate of the top of the chart.
 * @param {number} dataMin - The minimum value of the data.
 * @param {number} dataMax - The maximum value of the data.
 * @param {number} cMin - the minimum value of the color scale
 * @param {number} cMax - The maximum value of the color scale.
 * @param {boolean} dividingLine - boolean, // 是否显示分割线
 * @param {MATRIX} fMbMatrix - the matrix of the data
 * @param {number} equalW - equal width of the container
 * @param {number} equalH - equal height
 * @param {number} equalOffsetX - the offset of the equal sign
 * @param {number} equalOffsetY - the offset of the equal bar
 * @returns Nothing.
 */
const drawContainMB = (ctx: CanvasRenderingContext2D, WIDTH: number, HEIGHT: number, W: number, H: number, yW: number, tH: number, fData: MATRIX, fDX: number[], fDY: number[], xT: number, yT: number, dataMin: number, dataMax: number, cMin: number, cMax: number, dividingLine: boolean, fMbMatrix: MATRIX, equalW: number, equalH: number, equalOffsetX: number, equalOffsetY: number) => {
  if (fMbMatrix.length < 1 || !fMbMatrix || !dividingLine) return;
  ctx.beginPath();
  ctx.translate(yW, tH);
  const LW = 2; // 线宽
  ctx.lineWidth = LW;
  const p = [];
  for (let i: number = 0; i < fMbMatrix.length; i++) {
    p.push(convertToContainPos(fMbMatrix[i], fDX, fDY, xT, yT, W, H, equalW, equalH, equalOffsetX, equalOffsetY, LW));
  }
  ctx.fillStyle = 'black';

  ctx.moveTo(p[0][0], p[0][1]);
  const len = p.length;
  const size = 2 + 1.5;
  for (let i = 0; i < len; i++) {
    const w = p[i][2] > size ? p[i][2] : size;
    const h = p[i][3] > size ? p[i][3] : size;
    ctx.fillRect(p[i][0], p[i][1], w, h);
  }
  ctx.stroke();
  ctx.closePath();
};

/**
 * Draw the cover of the matrix
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} WIDTH - the width of the canvas
 * @param {number} HEIGHT - the height of the canvas
 * @param {number} W - width of the canvas
 * @param {number} H - height of the canvas
 * @param {any} yW - the width of the y-axis
 * @param {any} tH - the height of the top margin
 * @param {MATRIX} fData - the data matrix
 * @param {number[]} fDX - the x-coordinates of the feature
 * @param {number[]} fDY - the y-coordinate of the first point of the first feature
 * @param {number} xT - the x coordinate of the top left corner of the target area
 * @param {number} yT - the y-coordinate of the top of the track
 * @param {number} dataMin - the minimum value of the data
 * @param {number} dataMax - The maximum value of the data.
 * @param {number} cMin - the minimum value of the color scale
 * @param {number} cMax - the maximum value of the color scale
 * @param {boolean} dividingLine - boolean,
 * @param {MATRIX} fMbMatrix - the matrix of the MBs
 * @returns Nothing.
 */
const drawCoverMB = (ctx: CanvasRenderingContext2D, WIDTH: number, HEIGHT: number, W: number, H: number, yW: any, tH: any, fData: MATRIX, fDX: number[], fDY: number[], xT: number, yT: number, dataMin: number, dataMax: number, cMin: number, cMax: number, dividingLine: boolean, fMbMatrix: MATRIX) => {
  if (fMbMatrix.length < 1 || !fMbMatrix || !dividingLine) return;
  ctx.beginPath();
  ctx.translate(yW, tH);
  const LW = 2; // 线宽
  ctx.lineWidth = LW;
  const p = [];

  for (let i = 0; i < fMbMatrix.length; i++) {
    p.push(convertToCoverPos(fMbMatrix[i], fDX, fDY, xT, yT, W, H, LW));
  }
  ctx.fillStyle = 'black';
  ctx.moveTo(p[0][0], p[0][1]);
  const len = p.length;

  const size = 2 + 1.5;
  for (let i = 0; i < len; i++) {
    const w = p[i][2] > size ? p[i][2] : size;
    const h = p[i][3] > size ? p[i][3] : size;
    ctx.fillRect(p[i][0], p[i][1], w, h);
  }
  ctx.stroke();
  ctx.closePath();
};

/**
 * Given a colRow, fDX, fDY, xT, yT, W, H, equalW, equalH, equalOffsetX, equalOffsetY, LW, return the
 * position of the cell
 * @param colRow - The row and column of the current cell.
 * @param fDX - The width of each column.
 * @param fDY - The height of each row.
 * @param {number} xT - The number of columns in the grid.
 * @param {number} yT - The total number of rows in the grid.
 * @param {number} W - width of the container
 * @param {number} H - height of the canvas
 * @param {number} equalW - the width of the equal-sized grid
 * @param {number} equalH - the height of the equal-sized grid
 * @param {number} equalOffsetX - the offset of the first column of the grid.
 * @param {number} equalOffsetY - the offset of the first row of the grid.
 * @param {number} LW - Line width
 * @returns The coordinates of the bounding box of the object.
 */
const convertToContainPos = (colRow: Array<number>, fDX: Array<number>, fDY: Array<number>, xT: number, yT: number, W: number, H: number, equalW: number, equalH: number, equalOffsetX: number, equalOffsetY: number, LW: number): Array<number> => {
  const [row, col] = colRow;

  const cX = fDX.slice(0, col).reduce((a: number, c: number) => a + c, 0);
  const cY = fDY.slice(0, row).reduce((a: number, c: number) => a + c, 0);

  const x = cX / xT * equalW + equalOffsetX;

  const y = H - cY / yT * equalH - equalOffsetY - fDY[row] / yT * equalH;
  const _h = fDY[row] / yT * equalH + 1.5;
  const _w = fDX[col] / xT * equalW + 1.5;
  return [x, y, _w, _h];
};

/**
 * Given a row and column, the function returns the x and y coordinates of the top left corner of the
 * cell
 * @param colRow - the column and row of the current cell
 * @param fDX - Array<number>
 * @param fDY - The height of each row.
 * @param {number} xT - The number of columns in the grid.
 * @param {number} yT - The total number of rows in the grid.
 * @param {number} W - width of the canvas
 * @param {number} H - Height of the canvas
 * @param {number} LW - Line width
 * @returns The coordinates of the top left corner of the cover, the width and height of the cover.
 */
const convertToCoverPos = (colRow: Array<number>, fDX: Array<number>, fDY: Array<number>, xT: number, yT: number, W: number, H: number, LW: number): Array<number> => {
  const [row, col] = colRow;

  const cX = fDX.slice(0, col).reduce((a: number, c: number) => a + c, 0);
  const cY = fDY.slice(0, row).reduce((a: number, c: number) => a + c, 0);

  let x = cX / xT * W;

  if (col === 0) {
    x = 0;
  }

  const y = H - cY / yT * H - fDY[row] / yT * H;

  const _h = fDY[row] / yT * H + 1.5;
  const _w = fDX[col] / xT * W + 1.5;
  return [x, y, _w, _h];
};

export { drawOutlineTest, drawContainMB, drawCoverMB };

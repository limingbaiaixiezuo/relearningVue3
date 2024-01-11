import { minMax } from '../../ui';
import { chartConfig } from '../../../config/chart';
import { seriesNumPrecision } from '@/utils/mg-utils';
import { genAxisLabels } from '../../utils';

/**
 * @desc  计算特定绘图区域内字体能合理显示所需要的字体大小      要重写，，，，不能？？？？？？？用总体绘制空间大小计算，要用局部空间的数据作为计算依据
 * @param  base = 10 大
 * @param  base = 8 中
 * @param  base = 6 小
 **/

const calcF = (base: number, W: number, H: number): number => {
  let len = W > H ? H : W;
  if (len > 250) {
    len = 250;
  }
  return base + len / 80;
};

/**
 * @desc  获取坐标轴刻度对应的数据
 * @param  num---坐标个数
 * @param  xData---x轴应该显示的数据
 * @param  yData---y轴应该显示的数据
 * @param  hMin---custom range 水平 min
 * @param  hMax---custom range max
 * @param  vMin---custom range min
 * @param  vMax---custom range max
 **/

const getAxesMarkerLabel = (
  num: number,
  xData: number[],
  yData: number[],
  hMin: number,
  hMax: number,
  vMin: number,
  vMax: number
) => {
  const [xMin, xMax] = minMax(xData);
  const [yMin, yMax] = minMax(yData);

  const x = num === 1 ? xMax - xMin === 0 ? toMaxSN([xMax]) : toMaxSN([(xMax - xMin) / 2 + xMin])
    : toMaxSN(genAxisLabels(false, num, xData, xMin, xMax));
  const y = num === 1 ? yMax - yMin === 0 ? toMaxSN([yMax]) : toMaxSN([(yMax - yMin) / 2 + yMin])
    : toMaxSN(genAxisLabels(false, num, yData, yMin, yMax));

  return {
    x: x.label,
    xOrder: x.maxE,
    y: y.label,
    yOrder: y.maxE
  };
};

interface toMAXSN {
  maxE: number;
  label: Array<string>;
}

const toMaxSN = (arr: Array<number>): toMAXSN => {
  try {
    // console.log(arr, "toMaxSN 入参数据");
    const res = seriesNumPrecision(arr);
    // console.log(res, "toMaxSN res");
    const label = res.formateNums.map((i: { toString: () => any }) =>
      i.toString()
    );
    const maxE = res.exponential === undefined ? 0 : res.exponential;
    return { label, maxE };
  } catch (err) {
    console.log('toMAXSN error:', err);
    return { label: [''], maxE: 0 };
  }
};

// eslint-disable-next-line no-unused-vars
const convertToMax_E_SN = (
  maxE: number,
  sufEArr: Array<number>,
  prePointArr: Array<number>,
  betweenPointEArr: Array<string>
): Array<string> => {
  let newStrArr: Array<string> = [];
  // const minEIndex = sufEArr.findIndex(i => i === Math.min(...sufEArr))
  sufEArr.map((i: number, index: number) => {
    // console.log(maxE, i);
    const diff = Math.abs(maxE - i);
    // console.log("diff", diff);
    let newStr: any = null;

    const bPEStr = betweenPointEArr[index];

    let bPEStrFirstNum = Number(bPEStr.slice(0, 1));
    if (bPEStr.length >= 2) {
      // 精度到小数点后第二位
      if (Number(bPEStr.slice(1, 2)) >= 5) {
        // eslint-disable-next-line no-unused-vars
        bPEStrFirstNum += 1;
      }
    }
    // console.log("bPEStr", bPEStr);

    if (diff > 0) {
      const zero = [];
      for (let i = 0; i < diff - 1; i++) {
        zero.push('0');
      }
      const originPrePointStr = prePointArr[index];
      // console.log(originPrePointStr, prePointArr, 343434);

      const absPrePointStr = Number(
        originPrePointStr.toString().replace(/-/g, '')
      );
      // if (bPEStrFirstNum >= 5 && minEIndex === index) { // 只有最小的数字四舍五入
      //     originPrePointStr += 1
      // }
      // console.log(absPrePointStr, 4545455);

      if (originPrePointStr > 0) {
        newStr = `0.${zero.join().replace(/,/g, '')}${absPrePointStr}`;
      } else if (originPrePointStr < 0) {
        newStr = `-0.${zero.join().replace(/,/g, '')}${absPrePointStr}`;
      } else {
        newStr = '0';
      }
      // console.log(newStr, 5656565656);
    } else {
      const noDiffStr = prePointArr[index];
      // console.log(noDiffStr, 777777777777);

      newStr = noDiffStr.toString();
    }

    if (newStr.length < 4) {
      if (!newStr.includes('.')) {
        newStr = newStr + '.' + `${bPEStr}`;
      } else {
        newStr = newStr + `${bPEStr}`;
      }
    }

    newStrArr.push(newStr);
  });
  // console.log(newStrArr, 78787878);

  // const maxLong = Math.max(...newStrArr.map(i => i.length))
  newStrArr = newStrArr.map((i: string, index) => {
    return Number(Number(i).toFixed(3)).toString();
  });
  // console.log(newStrArr, 8989898989);

  if (newStrArr.length > 1) {
    // 最大最小极值差距100倍时，最小值置零
    const nums = newStrArr.map((i) => Number(i));

    if (Math.abs(Math.max(...nums) / Math.min(...nums)) > 100) {
      newStrArr[newStrArr.findIndex((i) => Number(i) === Math.min(...nums))] =
        '0';
    }
  }
  return newStrArr;
};

interface NEWSTRARR {
  sufEArr: Array<number>;
  prePointArr: Array<number>;
  betweenPointEArr: Array<string>;
}

// eslint-disable-next-line no-unused-vars
const getSnInfo = (arr: Array<string>): NEWSTRARR => {
  const sufEArr = [];
  const prePointArr = [];
  const betweenPointEArr = [];
  for (let i = 0; i < arr.length; i++) {
    const s = arr[i];
    if (s.includes('.') && s.includes('e')) {
      const prePoint = s.slice(0, s.indexOf('.'));
      const sufE = s.slice(s.indexOf('e') + 1);
      const between = s.slice(s.indexOf('.') + 1, s.indexOf('e'));
      prePointArr.push(Number(prePoint));
      betweenPointEArr.push(between);
      sufEArr.push(Number(sufE));
    } else if (s.includes('.') && !s.includes('e')) {
      const prePoint = s.slice(0, s.indexOf('.'));
      prePointArr.push(Number(prePoint));
      betweenPointEArr.push('');
      sufEArr.push(0);
      // console.log(s);
    } else if (!s.includes('.') && s.includes('e')) {
      const prePoint = s.slice(0, s.indexOf('e'));
      const sufE = s.slice(s.indexOf('e') + 1);
      prePointArr.push(Number(prePoint));
      betweenPointEArr.push('');
      sufEArr.push(Number(sufE));
    } else if (!s.includes('.') && !s.includes('e')) {
      prePointArr.push(Number(s));
      sufEArr.push(0);
      betweenPointEArr.push('');
    } else {
      console.warn('convertToMaxESn funcs unknow number string ..........');
    }
  }
  return { sufEArr, prePointArr, betweenPointEArr };
};

// eslint-disable-next-line no-unused-vars
const handleMouse = (dom: HTMLDivElement) => {
  dom.onmousemove = function(event: any) {
    // eslint-disable-next-line no-unused-vars
    const mouseX = event.clientX;
    // eslint-disable-next-line no-unused-vars
    const mouseY = event.clientY;
    // console.log(mouseX, mouseY)
    // round_arr.push({
    //     mouseX: mouseX,
    //     mouseY: mouseY,
    //     r: para.r,  // 设置半径每次增大的数值
    //     o: 1,    //  判断圆消失的条件，数值越大，消失得越快
    // })
  };
};

const getClickPointCoordinate = (dom: HTMLDivElement) => {
  dom.addEventListener('click', function(e) {
    // use event argument
    var rect = dom.getBoundingClientRect(); // get element's abs. position
    var x = e.clientX - rect.left; // get mouse x and adjust for el.
    var y = e.clientY - rect.top; // get mouse y and adjust for el.

    console.log('Mouse position: ' + x + ',' + y);
  });
};

/**
 * Given a value, find the corresponding color in the color bar
 * @param {number} d - the value of the data point
 * @param {number} min - the minimum value of the data
 * @param {number} max - The maximum value of the data.
 * @param {number} cusMin - the minimum value of the custom range
 * @param {number} cusMax - the maximum value of the custom range
 * @returns The hex color value for the given value.
 */
const getHexColorByCustomRange = (
  d: number,
  min: number,
  max: number,
  cusMin: number,
  cusMax: number
): string => {
  const colorBar = chartConfig.colorBar.colorData;
  if (d === null) {
    return '#ffffff';
  }

  if (cusMax === cusMin) {
    return rgbToHex(colorBar[0]);
  }

  if (d >= cusMin && d <= cusMax) {
    const index =
      max - min <= 0 ? 0 : Math.round(((d - cusMin) / (cusMax - cusMin)) * 767);

    return rgbToHex(colorBar[index]);
  }

  if (d < cusMin) {
    return rgbToHex(colorBar[0]);
  } else if (d > cusMax) {
    return rgbToHex(colorBar[767]);
  } else {
    return '';
  }
};

/**
 * Draw a rectangle with the given coordinates, width, height, and fill color
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w_ - the width of the rectangle
 * @param {number} h_ - height of the rectangle
 * @param {string | any[]} fData - The data array.
 * @param {number} i - The row index of the data point.
 * @param {number} j - The column index of the cell.
 * @param {number} dataMin - the minimum value of the data
 * @param {number} dataMax - the maximum value of the data
 * @param {number} cMin - the minimum value of the color range
 * @param {number} cMax - the maximum value of the color range.
 * @param mbMatrix - The matrix of booleans that determine whether or not a pixel should be drawn.
 */

const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w_: number,
  h_: number,
  fData: string | any[],
  i: number,
  j: number,
  dataMin: number,
  dataMax: number,
  cMin: number,
  cMax: number,
  mbMatrix: Array<Array<number>>,
  info: any
) => {
  ctx.fillStyle = getHexColorByCustomRange(
    fData[i][j],
    dataMin,
    dataMax,
    cMin,
    cMax
  );
  ctx.fillRect(x, y, w_ + 1, h_ + 1);
  if (info.meshGrid) {
    const correction = ctx.lineWidth % 2 ? 0.5 : 0;
    ctx.moveTo(x + correction, y + correction);
    ctx.lineTo(x + w_ + correction, y + correction);
    ctx.lineTo(x + w_ + correction, y + h_ + correction);
  }
};

const rgbToHex = (color: { toString: (arg0: number) => any }[]): string => {
  let color1 = color[0].toString(16);
  color1 = color1.length === 1 ? '0' + color1 : color1;
  let color2 = color[1].toString(16);
  color2 = color2.length === 1 ? '0' + color2 : color2;
  let color3 = color[2].toString(16);
  color3 = color3.length === 1 ? '0' + color3 : color3;
  return '#' + color1 + color2 + color3;
};

const createDiv = (H: number, W: number, zIndex?: number): HTMLDivElement => {
  const layer = document.createElement('div');
  layer.style.position = 'absolute';
  layer.style.height = `${H}px`;
  layer.style.width = `${W}px`;
  layer.style.zIndex = `${zIndex ?? 0}`;
  return layer;
};

const append = (
  dom: HTMLDivElement,
  div: HTMLDivElement,
  canvas: HTMLCanvasElement
) => {
  div.appendChild(canvas);
  dom.appendChild(div);
};
interface canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

const createCanvas = (H: number, W: number): canvas => {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.setAttribute('height', `${H}px`);
  canvas.setAttribute('width', `${W}px`);
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
};

// eslint-disable-next-line no-unused-vars
const saveImg = (canvasDom: HTMLCanvasElement, imageData: any) => {
  // imageData = ctx.getImageData(0, 0, 800, 400);
  // imageData && ctx.putImageData(imageData, 0, 0, 0, 0, 800, 400);
  // const x = e.pageX - canvas.offsetLeft;
  // const y = e.pageY - canvas.offsetTop;
  const url = canvasDom.toDataURL();
  const a = document.createElement('a');
  a.download = 'sunshine';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  //   var img = new Image();
  //   img.src = db.echartInstance.getDataURL({
  //     pixelRatio: 2,
  //     backgroundColor: '#fff'
  //   });
};

// eslint-disable-next-line no-unused-vars
const stroke = (
  matrix: Array<Array<number>>,
  i: number,
  j: number
): boolean => {
  let stroke = false;
  for (let a = 0; a < matrix.length; a = a + 1) {
    if (matrix[a][0] === i && matrix[a][1] === j) {
      stroke = true;
    }
  }
  return stroke;
};
interface POS {
  yW: number;
  cW: number;
  xH: number;
  tH: number;
}

const getPos = (HEIGHT: number, WIDTH: number): POS => {
  let yW = HEIGHT > 500 || WIDTH > 800 ? WIDTH * 0.3 : WIDTH * 0.25; // Y轴区域宽

  let cW = WIDTH * 0.2; // 色带区域宽
  let xH = HEIGHT * 0.16; // X轴区域高
  let tH = HEIGHT * 0.14; // 标题区域高

  if (yW > 110) {
    yW = 110;
  } else if (yW < 50) {
    yW = 50;
  }

  if (HEIGHT > 650) {
    yW = 150;
  }

  if (WIDTH > 850) {
    yW = 120;
  }

  if (xH > 80) {
    xH = 80;
  } else if (xH < 50) {
    xH = 50;
  }

  if (tH > 40) {
    tH = 40;
  } else if (tH < 30) {
    tH = 30;
  }

  if (cW > 90) {
    cW = 90;
  } else if (cW < 65) {
    cW = 65;
  }

  return { yW, cW, xH, tH };
};

const isEqual = (arr: Array<string>) => {
  const nums = arr.map((i) => Number(i));
  if (Math.max(...nums) === Math.min(...nums)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @desc  往二维数组指定位置插入一列
 * @param  origin---原数据
 * @param  template--- 模板数据
 * @param  vlue--- 插入列中的值
 **/
const addInactivePortData = (
  origin: Array<Array<number>>,
  template: Array<any>,
  value = null
) => {
  const columnInfo: Array<any> = [];
  const rowArr: Array<number> = [];
  template.forEach((i, index) => {
    rowArr.push(i);
    columnInfo.push({ index: index + 1, state: i.isActive });
  });
  const rowSaveColumn: Array<Array<any>> = []; // 以行的形式，保存本应该是列的数据
  let globalIndex = 0;
  columnInfo.forEach((i, index) => {
    if (i.state) {
      rowSaveColumn[index] = origin.map((i) => i[globalIndex]);
      globalIndex++;
    } else {
      rowSaveColumn[index] = rowArr.map(() => {
        return value;
      });
    }
  });

  return columnToRow(rowSaveColumn);
};

const columnToRow = (matrix: Array<Array<number>>) => {
  // 二维数据中的列数据转换成行数据，
  return matrix[0].map((col, i) => {
    return matrix.map((row) => {
      return row[i];
    });
  });
};

const setupCanvas = (canvas: {
  getBoundingClientRect: () => any;
  width: number;
  height: number;
  getContext: (arg0: string) => any;
}) => {
  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
};

/**
 * 绘制水平直线
 * @param ctx
 * @param y
 * @param left
 * @param right
 */
// function renderHorizontalLine(ctx, y, left, right) {
//   ctx.beginPath();
//   const correction = (ctx.lineWidth % 2) ? 0.5 : 0;
//   ctx.moveTo(left, y + correction);
//   ctx.lineTo(right, y + correction);
//   ctx.stroke();
//   ctx.closePath();
// }

function drawHorizontalLine(
  ctx: CanvasRenderingContext2D,
  y: number,
  left: number,
  right: number
) {
  const correction = ctx.lineWidth % 2 ? 0.5 : 0;
  ctx.moveTo(left, y + correction);
  ctx.lineTo(right, y + correction);
}

/**
 * 绘制垂直直线
 * @param ctx
 * @param x
 * @param top
 * @param bottom
 */
// function renderVerticalLine(ctx, x, top, bottom) {
//   ctx.beginPath();
//   const correction = (ctx.lineWidth % 2) ? 0.5 : 0;
//   ctx.moveTo(x + correction, top);
//   ctx.lineTo(x + correction, bottom);
//   ctx.stroke();
//   ctx.closePath();
// }

function drawVerticalLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  top: number,
  bottom: number
) {
  const correction = ctx.lineWidth % 2 ? 0.5 : 0;
  ctx.moveTo(x + correction, top);
  ctx.lineTo(x + correction, bottom);
}

export {
  getClickPointCoordinate,
  calcF,
  getAxesMarkerLabel,
  getHexColorByCustomRange,
  createDiv,
  append,
  createCanvas,
  drawRect,
  getPos,
  toMaxSN,
  isEqual,
  addInactivePortData,
  setupCanvas,
  drawHorizontalLine,
  drawVerticalLine
};

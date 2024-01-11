import { chartConfig } from '../../../config/chart';
import { calcF, toMaxSN } from './help';

/**
 * @desc  绘制强度图色带
 * @param  ctx---canvas 实例
 * @param  H---canvas 长度
 * @param  W---canvas 宽度
 * @param  colorNum---颜色数量
 * @param  barWidth---色带宽度
 * @param  min---最小强度值
 * @param  max---最大强度值
 **/

const drawColorBar = (ctx: CanvasRenderingContext2D, H: number, W: number, colorNum: number, barWidth: number, max: number, min: number) => {
  const barY = 0;
  const colorBarWidth = barWidth;
  var lingrad = ctx.createLinearGradient(0, 0, 0, H);

  for (let i = 0; i <= 8; i++) {
    const index = 96 * i === 768 ? 767 : 96 * i;
    lingrad.addColorStop(0.125 * i, getHexColorByIndex(index));
  }
  ctx.fillStyle = lingrad;
  ctx.fillRect(W + 5 + 2, barY, colorBarWidth, H + 1);

  const xOffset = 10;
  ctx.font = `${calcF(9, W, H)}px Arial`;
  ctx.fillStyle = '#303133';
  const F = 8;
  let cLabel = null;
  if (max === min && min === 0) {
    ctx.fillText('0', W + xOffset + colorBarWidth, H);
  } else if (max === min && min !== 0) {
    cLabel = toMaxSN([max, min]);
    ctx.fillText(cLabel.label[0], W + xOffset + colorBarWidth, 5);
    ctx.fillText(cLabel.label[0], W + xOffset + colorBarWidth, H);
  } else if (max !== min && min === 0) {
    cLabel = toMaxSN([max]);
    ctx.fillText(cLabel.label[0], W + xOffset + colorBarWidth, 5);
    ctx.fillText('0', W + xOffset + colorBarWidth, H);
    if (cLabel.maxE !== 0) {
      ctx.font = `${calcF(F, W, H)}px Arial`;
      ctx.fillText(`(x10^${cLabel.maxE})`, W + xOffset + colorBarWidth / 2 + 8, H / 2 - F / 2);
    }
  } else if (max !== min && max === 0) {
    cLabel = toMaxSN([min]);
    ctx.fillText('0', W + xOffset + colorBarWidth, 5);
    ctx.fillText(cLabel.label[0], W + xOffset + colorBarWidth, H);
    if (cLabel.maxE !== 0) {
      ctx.font = `${calcF(F, W, H)}px Arial`;
      ctx.fillText(`(x10^${cLabel.maxE})`, W + xOffset + colorBarWidth / 2 + 8, H / 2 - F / 2);
    }
  } else {
    cLabel = toMaxSN([max, min]);
    const highest = (max - min === 0) ? '0' : cLabel.label[0];
    ctx.fillText(highest, W + xOffset + colorBarWidth, 5);
    if ((Math.abs(min) > 0) && (Math.abs(max / min) > 100) || Math.abs(min) === 0) {
      ctx.fillText('0', W + xOffset + colorBarWidth, H);
    } else {
      ctx.fillText(cLabel.label[1], W + xOffset + colorBarWidth, H);
    }
    if (cLabel.maxE !== 0) {
      ctx.font = `${calcF(F, W, H)}px Arial`;
      ctx.fillText(`(x10^${cLabel.maxE})`, W + xOffset + colorBarWidth / 2 + 8, H / 2 - F / 2);
    }
  }
  ctx.closePath();
};

const getHexColorByIndex = (index: number) => {
  const colorBar = chartConfig.colorBar.colorData;
  return rgbToHex(colorBar[767 - index]);
};

const rgbToHex = (color: { toString: (arg0: number) => any; }[]) => {
  let color1 = color[0].toString(16);
  color1 = color1.length === 1 ? '0' + color1 : color1;
  let color2 = color[1].toString(16);
  color2 = color2.length === 1 ? '0' + color2 : color2;
  let color3 = color[2].toString(16);
  color3 = color3.length === 1 ? '0' + color3 : color3;
  return '#' + color1 + color2 + color3;
};

export default drawColorBar;

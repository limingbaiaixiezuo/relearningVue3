
import { calcF } from './help';

/**
 * @desc
 * @param  ctx---canvas 实例
 * @param  W---canvas 宽度
 * @param  H---canvas 高度
 **/

const drawTitle = (ctx: CanvasRenderingContext2D, Title: any, W: number, H: number, tH: number) => {
  ctx.beginPath();
  const F = 10;
  ctx.font = `${calcF(F, W, H)}px Arial`;
  ctx.fillStyle = '#303133';
  const strWidth = ctx.measureText(Title).width;

  ctx.fillText(`${Title}`, W / 2 - strWidth / 2, -F - 12);
};

export default drawTitle;

/*
 * @Author: lmb lichunming@max-optics.com
 * @Date: 2022-06-29 17:12:58
 * @LastEditors: lmb lichunming@max-optics.com
 * @LastEditTime: 2022-07-01 14:32:44
 * @FilePath: /aquaman/packages/mg-angelfish/src/visualizer/functions/draw/intensityCanvas/drawZoomTest.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { debounce } from '../../ui';

const drawZoom = (zoomTestDiv: HTMLDivElement, zoomCtx: CanvasRenderingContext2D, zoomCanvas: HTMLCanvasElement, W: number, H: number, yW: number, tH: number) => {
  const zW = W;
  const zH = H;
  let scale = 1;
  let originx = 0;
  let originy = 0;
  //   zoomCtx.translate(yW, tH);
  const z = zoomCtx;
  //   const STARTANIMATION = false;
  const draw = () => {
    // const ratio = 1;
    // const centerRatio = 0.5;
    // z.save();
    // z.translate(zW * centerRatio, zH * centerRatio); // 缩放中心
    // z.scale(ratio, ratio);
    // z.translate(-zW * centerRatio, -zH * centerRatio);
    // scale < 1 ? z.clearRect(-zW / scale, -zH / scale, zW * 2 / scale, zH * 2 / scale) : z.clearRect(-100, -100, zW * scale + 100, zH * scale + 100);
    scale < 1 ? z.clearRect(-zW / scale, -zH / scale, zW * 2 / scale, zH * 2 / scale) : z.clearRect(0, 0, zW * scale, zH * scale);
    // scale < 1 ? z.clearRect(-zW, -zH, zW * 2, zH * 2) : z.clearRect(-100, -100, zW * scale + 100, zH * scale + 100);
    // z.translate(originx, originy); // TTTTTTTTTTTTTTTTTTTTTTTTTTTT
    z.fillStyle = 'green';
    z.fillRect(0, 0, zW, zH);
    // z.fillRect(originx, originx, zW / scale, zH / scale);
    z.fillStyle = 'pink';
    z.fillRect(40, 40, zW - 80, zH - 80);

    z.fillStyle = 'yellow';

    z.fillRect(zW / 4, zH / 4, zW / 2, zH / 2);

    z.fillStyle = 'red';
    z.fillRect(zW * 3 / 8, zH * 3 / 8, zW / 4, zH / 4);
    /* A test code. */
    // console.log(11111111111, STARTANIMATION);

    // z.restore();
    requestAnimationFrame(draw);

    // debounce(() => { STARTANIMATION = false; }, 1000 * 2, false);
  };

  draw();
  //   cancelAnimationFrame(ID);

  //   setTimeout(() => {
  //     STARTANIMATION = false;
  //   }, 2000);

  zoomCanvas.onwheel = (event: { clientX: number; clientY: number; wheelDelta: number; }) => {
    // if (!STARTANIMATION) {
    //   draw();
    // }
    // STARTANIMATION = true;
    const mousex = event.clientX - zoomCanvas.offsetLeft;
    const mousey = event.clientY - zoomCanvas.offsetTop;
    const wheel = event.wheelDelta / 120;// n or -n

    const zoom = 1 + wheel / 2;
    // if (zoom > 3) {
    //   zoom = 3;
    // } else if (zoom < 0.5) {
    //   zoom = 0.5;
    // }

    resize(zoom, mousex, mousey);
  };

  const resize = debounce((zoom: number, mousex: number, mousey: number) => {
    z.translate(
      originx,
      originy
    );
    z.scale(zoom, zoom);
    z.translate(
      -(mousex / scale + originx - mousex / (scale * zoom)),
      -(mousey / scale + originy - mousey / (scale * zoom))
    );

    originx = (mousex / scale + originx - mousex / (scale * zoom));
    originy = (mousey / scale + originy - mousey / (scale * zoom));
    scale *= zoom;

    // console.log(zoom, 55555555);
    // throttle(() => {
    //   STARTANIMATION = false;
    //   cancelAnimationFrame(ID);
    // }, 1000 * 2);
    // setTimeout(() => {

    // }, 20000);
  }, 1000 / 60, false);
};

export default drawZoom;

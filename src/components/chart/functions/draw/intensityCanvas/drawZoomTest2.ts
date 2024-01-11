/*
 * @Author: lmb lichunming@max-optics.com
 * @Date: 2022-06-29 17:12:58
 * @LastEditors: lmb lichunming@max-optics.com
 * @LastEditTime: 2022-07-01 11:28:41
 * @FilePath: /aquaman/packages/mg-angelfish/src/visualizer/functions/draw/intensityCanvas/drawZoomTest.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const drawZoom = (zoomTestDiv: HTMLDivElement, zoomCtx: CanvasRenderingContext2D, zoomCanvas: HTMLCanvasElement, W: number, H: number, yW: number, tH: number) => {
  const zoomIntensity = 0.03;
  let scale = 1;
  let originx = 0;
  let originy = 0;
  const z = zoomCtx;
  const draw = () => {
    scale < 1 ? z.clearRect(-W / scale, -H / scale, W * 2 / scale, H * 2 / scale) : z.clearRect(-100, -100, W * scale + 100, H * scale + 100);

    // z.fillStyle = 'black';
    // z.fillRect(10, 10, 100, 100);

    // z.fillStyle = 'black';
    // z.fillRect(W / 4, H / 4, W / 2, H / 2);

    z.fillStyle = 'green';
    z.fillRect(0, 0, W, H);
    z.fillStyle = 'pink';
    z.fillRect(40, 40, W - 80, H - 80);
    z.fillStyle = 'yellow';
    z.fillRect(W / 4, H / 4, W / 2, H / 2);
    z.fillStyle = 'red';
    z.fillRect(W * 3 / 8, H * 3 / 8, W / 4, H / 4);
    requestAnimationFrame(draw);
  };

  draw();
  zoomCanvas.onwheel = (event: {
      [x: string]: any; clientX: number; clientY: number; deltaY: number;
}) => {
    event.preventDefault();
    // Get mouse offset.
    const zoomBCR = zoomCanvas.getBoundingClientRect();
    const mousex = event.clientX - zoomBCR.x - moveX;
    const mousey = event.clientY - zoomBCR.y - moveY;

    // Normalize mouse wheel movement to +1 or -1 to avoid unusual jumps.
    const wheel = event.deltaY < 0 ? 1 : -1;

    // Compute zoom factor.
    const zoom = Math.exp(wheel * zoomIntensity);
    resize(zoom, mousex, mousey);
  };

  const resize = (zoom: number, mousex: number, mousey: number) => {
    // Translate so the visible origin is at the z's origin.
    z.translate(originx, originy);

    // Compute the new visible origin. Originally the mouse is at a
    // distance mouse/scale from the corner, we want the point under
    // the mouse to remain in the same place after the zoom, but this
    // is at mouse/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    originx -= mousex / (scale * zoom) - mousex / scale;
    originy -= mousey / (scale * zoom) - mousey / scale;

    // Scale it (centered around the origin due to the trasnslate above).
    z.scale(zoom, zoom);
    // Offset the visible origin to it's proper position.
    z.translate(-originx, -originy);

    // Update scale and others.
    scale *= zoom;

    console.log(scale, 'scale');
  };

  let moveX = 0;
  let moveY = 0;
  var isDown = false;
  zoomCanvas.addEventListener('mousedown', () => {
    isDown = true;
  }, true);

  zoomCanvas.addEventListener('mouseup', () => {
    isDown = false;
    zoomCanvas.style.cursor = 'auto';
  }, true);
  zoomCanvas.addEventListener('mouseout', () => {
    isDown = false;
    zoomCanvas.style.cursor = 'auto';
  }, true);

  zoomCanvas.addEventListener('mousemove', (e: any) => {
    e.preventDefault();
    if (isDown) {
      zoomCanvas.style.cursor = 'move';
      scale === 1 ? z.clearRect(0, 0, W + 100, H + 100) : scale < 1 ? z.clearRect(-W / scale, -H / scale, W * 2 / scale - 100, H * 2 / scale - 100) : z.clearRect(-100 * scale, -100 * scale, W * scale + 100 * scale, H * scale + 100 * scale);
      z.translate(e.movementX / scale, e.movementY / scale);
      moveX += e.movementX;
      moveY += e.movementY;
      console.log(moveX, moveY, scale, 'moveX moveY scale 依据此数据: 可以推算出除缩放后，移动后，横轴和纵轴坐标起始位置', W, H);
    }
  }, true);

  zoomCanvas.addEventListener('drag', () => {
    console.log('dragging');
    //   ctx.translate(x, y);
  });
};

export default drawZoom;

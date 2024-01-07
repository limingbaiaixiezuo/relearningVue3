
import { reactive, toRef } from 'vue';

// Scroll sensitivity
const MIN_DISTANCE = 30;

export const Direction = {
  Left: 'left',
  Right: 'right'
};

export const useTouch = () => {
  const touch = reactive({
    startX: 0,
    startY: 0,
    direction: undefined
  });

  // Reset touch cache
  const reset = () => {
    touch.startX = 0;
    touch.startY = 0;
    touch.direction = undefined;
  };

  // Listening start to scroll
  const start = (e) => {
    const { clientX, clientY } = e.touches[0];
    touch.startX = clientX;
    touch.startY = clientY;
    touch.direction = undefined;
  };

  // Listening scroll
  const move = (e) => {
    const { clientX, clientY } = e.touches[0];
    let direction;
    const { startX, startY } = touch;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    // Horizontal scrolling
    if (absX > absY) {
      // Left scrolling
      if (deltaX + MIN_DISTANCE < 0) {
        direction = Direction.Left;
      }
      // Right scrolling
      if (deltaX > MIN_DISTANCE) {
        direction = Direction.Right;
      }
    }
    touch.direction = direction;
    return direction;
  };

  // Listening the end of scroll and calculate the effective direction
  const end = () => {
    // Reset cache
    reset();
  };

  return {
    start,
    end,
    move,
    direction: toRef(touch, 'direction')
  };
};

import { ref } from 'vue';
import { isTouchEvent, isMouseEvent, resizeFormat } from '../utils';
import { Direction } from '../constants';

export function useResize({ height = [], width, update, setResizeDay, tasks }) {
  const resizeRef = ref(null);

  const onMouseMove = (event) => {
    const isRight = resizeRef.value?.direction === Direction.Right;
    const clientX = isTouchEvent(event) ? event.touches[0]?.clientX : event.clientX;
    const clientY = isTouchEvent(event) ? event.touches[0]?.clientY : event.clientY;
    const diffY = (clientY || 0) - (resizeRef.value?.clientY || 0);
    const diffX = (clientX || 0) - (resizeRef.value?.clientX || 0);
    const topF = (resizeRef.value?.top || 0) % height.value[0];
    let week = 0;
    let day = 0;
    if (isRight) {
      const bottomY = diffY + topF - height.value[0];
      if (diffY > 0 && bottomY > 0) {
        week = Math.ceil(bottomY / height.value[0]);
      } else {
        week = 0;
      }
      day = Math.ceil(diffX / width.value) + 7 * week;
    } else {
      const topY = -diffY - topF;
      if (diffY < 0 && topY > 0) {
        week = Math.ceil(topY / height.value[0]);
      } else {
        week = 0;
      }
      day = Math.ceil(-diffX / width.value) + 7 * week;
    }
    setResizeDay(day);

    resizeRef.value = {
      ...resizeRef.value,
      day
    };
  };

  const onResizeStart = (event, id, direction) => {
    const parentNode = event.target.parentNode;
    let clientX = 0;
    let clientY = 0;

    if (isMouseEvent(event)) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (isTouchEvent(event)) {
      clientX = event.touches[0]?.clientX || 0;
      clientY = event.touches[0]?.clientY || 0;
    }

    resizeRef.value = { id, clientX, clientY, direction, top: parseInt(parentNode.style.top), day: 0 };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseup);
  };

  const onMouseup = () => {
    const direction = resizeRef.value?.direction;
    const day = resizeRef.value?.day;

    if (day && update) {
      const task = tasks.value.filter(t => resizeRef.value?.id === t.id)[0];
      const { startDate, endDate } = task;
      const formatData = resizeFormat({ startDate, endDate, day, direction });
      update(task.id, formatData.startDate, formatData.endDate);
    }
    resizeRef.value = undefined;
    setResizeDay(0);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseup);
  };

  return {
    onResizeStart,
    resizeData: resizeRef
  };
};

/*
 * @Author: yinmingdi
 * @Date: 2022-06-21 16:25:22
 * @Description:
 *
 */
import { ref } from 'vue';
import { isBrowser } from '@/utils/mg-utils';

let width;
let height;

export function useWindowSize() {
  if (!width) {
    width = ref(0);
    height = ref(0);

    if (isBrowser) {
      const update = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
      };

      update();
      window.addEventListener('resize', update, { passive: true });
    }
  }

  return { width, height };
}

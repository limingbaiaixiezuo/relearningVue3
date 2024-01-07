import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useWindowSize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const updateSize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', updateSize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateSize);
  });

  return { width, height };
}

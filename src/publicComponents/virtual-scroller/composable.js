import { nextTick, ref, watch } from 'vue';
import { useRect } from '@/composable';

export const useVirtualData = (props) => {
  const scrollWrapRef = ref(null);
  const visibleItems = ref([]);
  const totalHeight = ref(0);
  const startVisibleIndex = ref(0);

  watch(() => props.items, async () => {
    await nextTick();
    updateTotalHeight();
    updateVisibleItems();
  }, {immediate: true, deep: true});

  const updateTotalHeight = () => {
    totalHeight.value = props.items.length * props.itemHeight;
  };

  const getStartVisibleIndex = () => {
    if (!scrollWrapRef.value) return 0;
    const { scrollTop } = scrollWrapRef.value;
    startVisibleIndex.value = Math.max(
      0,
      Math.floor(scrollTop / props.itemHeight) - props.cache
    );
    return startVisibleIndex.value;
  };

  const getEndVisibleIndex = () => {
    if (!scrollWrapRef.value) return 0;
    const { scrollTop } = scrollWrapRef.value;
    const { cache } = props;

    const visibleCount = getVisibleCount();
    return Math.min(
      props.items.length - 1,
      Math.floor(scrollTop / props.itemHeight) + visibleCount + cache
    );
  };

  const getVisibleCount = () => {
    const { itemHeight } = props;
    const { height } = useRect(scrollWrapRef);
    return Math.ceil(height / itemHeight);
  };

  const updateVisibleItems = () => {
    const firstIndex = getStartVisibleIndex();
    const endIndex = getEndVisibleIndex();
    visibleItems.value = props.items.slice(firstIndex, endIndex + 1);
  };

  const scrollHandler = (e) => {
    updateVisibleItems();
  };

  return {
    visibleItems,
    scrollHandler,
    updateVisibleItems,
    totalHeight,
    startVisibleIndex,
    scrollWrapRef
  };
};

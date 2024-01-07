import {
  watch,
  isRef,
  unref,
  nextTick,
  onMounted,
  onActivated,
  onUnmounted,
  onDeactivated
} from 'vue';

export function useEventListener(
  type,
  listener,
  options = {}
) {
  const { target = window, passive = false, capture = false } = options;

  let cleaned = false;
  let mounted;
  let attached;

  const add = (target) => {
    if (cleaned) {
      return;
    }
    const element = unref(target);

    if (element && !attached) {
      element.addEventListener(type, listener, {
        capture,
        passive
      });
      attached = true;
    }
  };

  const remove = (target) => {
    if (cleaned) {
      return;
    }
    const element = unref(target);

    if (element && attached) {
      element.removeEventListener(type, listener, capture);
      attached = false;
    }
  };

  onUnmounted(() => remove(target));
  onDeactivated(() => remove(target));

  onMounted(() => {
    add(target);
    nextTick(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      add(target);
    }
  });

  let stopWatch;

  if (isRef(target)) {
    stopWatch = watch(target, (val, oldVal) => {
      remove(oldVal);
      add(val);
    });
  }

  /**
   * Clean up the event listener
   */
  return () => {
    stopWatch?.();
    remove(target);
    cleaned = true;
  };
}

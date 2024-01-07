import { unref } from 'vue';
import { inBrowser } from '@/utils';
import { useEventListener } from '../use-event-listener';

export function useClickAway(
  target,
  listener,
  options = {eventName: 'click'}
) {
  if (!inBrowser) {
    return;
  }

  const { eventName } = options;

  const onClick = (event) => {
    const targets = Array.isArray(target) ? target : [target];
    const isClickAway = targets.every((item) => {
      const element = unref(item);
      return element && !element.contains(event.target);
    });

    if (isClickAway) {
      listener(event);
    }
  };

  useEventListener(eventName, onClick, { target: document, capture: true });
}

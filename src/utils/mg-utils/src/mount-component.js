/*
 * @Author: yinmingdi
 * @Date: 2022-03-07 18:41:20
 * @Description:
 *
 */
import { createApp, reactive, getCurrentInstance } from 'vue';
import { extend } from '../index';

export function useExpose(apis) {
  const instance = getCurrentInstance();
  if (instance) {
    extend(instance.proxy, apis);
  }
}

export function usePopupState() {
  const state = reactive({
    modelValue: false
  });

  const toggle = (modelValue) => {
    state.modelValue = modelValue;
  };

  const open = (props) => {
    return new Promise((resolve) => {
      extend(state, props, {
        callback(rest) {
          resolve(rest);
        }
      });
      toggle(true);
    });
  };

  const close = () => toggle(false);

  useExpose({ open, close, toggle, state });

  return {
    open,
    close,
    state,
    toggle
  };
}

export function mountComponent(RootComponent) {
  const app = createApp(RootComponent);
  const root = document.createElement('div');

  document.body.appendChild(root);

  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    }
  };
}

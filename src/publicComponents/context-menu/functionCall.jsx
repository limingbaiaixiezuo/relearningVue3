/*
 * @Author: yinmingdi
 * @Date: 2022-03-04 16:51:35
 * @Description: 右击菜单
 *
 */
import ContextMenu from './ContextMenu';
import { mount, unmount } from '@/utils';

let instance = null;
/**
 * @description: 函数调用组件入口
 * @param {*} options
 * @return {*}
 */

export function close() {
  unmount(instance.$rootEl);
  instance.$rootEl.remove();
  instance = null;
}

const initInstance = (options, resolve) => {
  const defaultOptions = {
    visible: true,
    onClose() {
      close();
      resolve();
    }
  };
  const completeOptions = Object.assign({}, options, defaultOptions);
  const rootEl = document.createElement('div');
  document.body.appendChild(rootEl);

  const mountOptions = {
    el: rootEl,
    component: ContextMenu,
    props: completeOptions
  };

  instance = mount(mountOptions);
  instance.$rootEl = rootEl;
};

export function showContextMenu(options) {
  if (instance) close();

  return new Promise((resolve, reject) => {
    if (!instance) {
      initInstance(options, resolve);
    }
  });
}


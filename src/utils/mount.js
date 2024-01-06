
// vue 组件的动态挂载和卸载
import { createVNode, render} from 'vue';

// 非标准组件的挂载 不应当继续使用
export function mount({el, component, props, append = false}) {
  let container = el;
  if (append) {
    container = document.createElement('div');
    el.append(container);
  }
  const instance = createVNode(component, props);
  instance.appContext = globalThis.vueApp._context;
  render(instance, container);
  return instance.component.proxy;
}

export function unmount(root) {
  if (root.$el) {
    render(null, root.$el);
    root.$el.remove();
  } else {
    render(null, root);
  }
}

/*
 * @Author: yinmingdi
 * @Date: 2022-03-04 16:51:35
 * @Description: 右击菜单
 *
 */
import { mountComponent, withInstall, usePopupState } from '../index';

/**
 * @description: 初始化组件
 * @param {*}
 * @return {*}
 */
function initialInstance(Component) {
  const Wrapper = {
    setup() {
      const { state, toggle } = usePopupState();
      return () => <Component {...state} onUpdate:modelValue={toggle}></Component>;
    }
  };

  return mountComponent(Wrapper);
}

/**
 * @description: 初始化
 * @param {*}
 * @return {*}
 */
function initialPropty(name, Component, defaultOptions, functionCall) {
  functionCall.defaultOptions = defaultOptions;
  functionCall.currentOptions = Object.assign({}, defaultOptions);
  functionCall.Component = withInstall(Component);

  /**
   * @description:vue 插件安装函数
   * @param {*} app
   * @return {*}
   */
  functionCall.install = (app) => {
    app.use(functionCall.Component);
    app.config.globalProperties[`$${name}`] = functionCall;
  };
}

/**
 * @description 创建函数式调用
 * @param {*} component
 * @returns
 */
export function createFunctionCall(name, Component, defaultOptions) {
  let instance = null;

  initialPropty(name, Component, defaultOptions, functionCall);

  /**
   * @description: 函数调用组件入口
   * @param {*} options
   * @return {*}
   */
  function functionCall(options) {
    return new Promise((resolve) => {
      if (!instance) ({ instance } = initialInstance(Component));

      instance.open(
        Object.assign({}, functionCall.defaultOptions, options, {
          callback: (action) => {
            resolve(action);
          }
        })
      );
    });
  };

  return functionCall;
}

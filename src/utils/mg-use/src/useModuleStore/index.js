/*
 * @Author: yinmingdi
 * @Date: 2022-06-20 18:25:30
 * @Description:
 *
 */
import {
  provide,
  inject,
  reactive,
  watch
} from 'vue';
import { deepAssign, deepClone } from '@/utils/mg-utils';

// const moduleA = {
//   state: {},
//   actions: {}
// };
// const moduleB = {
//   state: {},
//   actions: {}
// };

// const config = {
//   state: {},
//   modules: {
//     moduleA,
//     moduleB
//   }
// };

// function resolveStore(config) {
//   const store = {
//     state: config.state,
//     actions: config.actions
//   };

//   return store;
// }

// function resolveConfig(config) {
//   if (!config) return;

//   const store = resolveStore(config);
//   const modules = config.modules;

//   Object.keys(modules).forEach(moduleName => {
//     const module = modules[moduleName];
//     const moduleStore = resolveStore(module);

//     store[moduleName] = moduleStore;
//   });

//   return store;
// }

// export function useCreateModuleStore(moduleName, config) {
//   const store = resolveConfig(config);

//   const baseDispatch = (key, module, payload) => {
//     const callback = module.actions[key];
//     if (!callback) throw Error(`action ${key} is not find`);

//     // ctx = { dispatch, state, rootState }
//     // payload
//     const context = {
//       state: module.state,
//       rootState: store.state
//     };

//     callback(context, payload);
//   };

//   const moduleDispatch = (dispatchName, moduleName, payload) => {
//     const module = store[moduleName];
//     baseDispatch(dispatchName, module, payload);
//   };

//   store.dispatch = (key, payload) => {
//     // key = 'moduleA/save' || 'save'
//     const [moduleName, dispatchName] = key.split('/');
//     if (dispatchName) {
//       moduleDispatch(dispatchName, moduleName, payload);
//     } else {
//       baseDispatch(moduleName, store, payload);
//     }
//   };

//   provide(moduleName, store);
//   return store;
// }

export function useCreateModuleStore(moduleName, { state = {}, actions = {}}) {
  // 最大日志
  const maxLog = 50;
  const dispatchLog = [];
  const defaultState = deepClone(state);
  const proxyState = reactive(state);

  const addLog = (value) => {
    if (dispatchLog.length >= maxLog) dispatchLog.shift();
    dispatchLog.push(value);
  };

  if (process.env.NODE_ENV === 'development') {
    watch(() => deepClone(proxyState), addLog, { deep: true });
  }

  const dispatch = (key, payload) => {
    const callback = actions[key];
    if (!callback) throw Error(`action ${key} is not find`);

    callback({ state: proxyState, dispatch }, payload);
  };

  const resetState = () => {
    deepAssign(proxyState, defaultState);
  };

  const store = {
    state: proxyState,
    dispatchLog,
    dispatch,
    resetState
  };

  provide(moduleName, store);
  return store;
}

export function useModuleStore(moduleName) {
  const store = inject(moduleName);
  return store;
}

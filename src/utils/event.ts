
// var events = {};
// var getCallbacks = name => events[name] || (events[name] = []);

// export function on(name, cb, thisObj) {
//   var callbacks = getCallbacks(name);
//   if (callbacks.some(([_cb, _thisObj]) => _cb === cb && _thisObj === thisObj)) return;
//   callbacks.push([cb, thisObj]);
// }

// export function off(name, cb, thisObj) {
//   var callbacks = getCallbacks(name);
//   var cbIndex = callbacks.findIndex(([_cb, _thisObj]) => _cb === cb && _thisObj === thisObj);
//   if (cbIndex !== -1) {
//     callbacks.splice(cbIndex, 1);
//   }
// }

// export async function notify(name, ...args) {

//   var callbacks = getCallbacks(name);

//   return Promise.all(callbacks.map(([cb, thisObj]) => cb.call(thisObj, ...args)));
// }

interface BusEvent {
  on: (name: string, cb: Function, thisObj?: object) => void;
  off: (name: string, cb: Function, thisObj?: object) => void;
  notify: (name: string, ...args: any[]) => Promise<any[]>
}

class Observer implements BusEvent {
  events = new Map<string, [Function, object | undefined][]>();

  // 订阅者模式需事先注册
  registeredEvents = [
    "panelChanged",  // 页面布局事件
    "toggleFullscreen", // 页面全屏事件
    "showELMessage", // 提示信息事件
    "status", // 最下方状态栏信息事件
    "modalShow", //dialog显示事件
    "updateModal", //updateModal事件
    "modalCancel", //dialog取消事件
    "modalResult", //dialog确定事件
    "reload", // 初始化任务列表（吴逸凡需要更改名称）
    "changeView", // cad切换视图事件
    "showMenu", // showMenu事件
    "dialogOpen", // 更新 waveform dialog里echarts更新
  ]

  getCallbacks(name: string): [Function, object | undefined][] {
    if (!this.registeredEvents.includes(name)) {
      console.error(`请先把${name}事件，注册为观察者模式`);
      return [];
    };
    if (!this.events.has(name)) {
      this.events.set(name, []);
    }
    return this.events.get(name) as [Function, object | undefined][];
  }

  on(name: string, cb: Function, thisObj?: object): void {
    const callbacks = this.getCallbacks(name);
    if (callbacks.some(([_cb, _thisObj]: [Function, object | undefined]) => _cb === cb && _thisObj === thisObj)) return;
    callbacks.push([cb, thisObj]);
  }

  off(name: string, cb: Function, thisObj?: object): void {
    const callbacks = this.getCallbacks(name);
    const cbIndex = callbacks.findIndex(([_cb, _thisObj]: [Function, object | undefined]) => _cb === cb && _thisObj === thisObj);
    if (cbIndex !== -1) {
      callbacks.splice(cbIndex, 1);
    }
  }

  async notify(name: string, ...args: any[]): Promise<any[]> {
    const callbacks = this.getCallbacks(name);
    return Promise.all(callbacks.map(([cb, thisObj]: [Function, object | undefined]) => cb.call(thisObj, ...args)));
  }

  watchEvents() {
    // console.log('观察者模式:', this.events);
  }
}
export const observer = new Observer();

const on = observer.on.bind(observer);
const off = observer.off.bind(observer);
const notify = observer.notify.bind(observer);
//暂时暴露在全局下
const watchEvents = (window as any).watchEvents = observer.watchEvents.bind(observer);

export { on, off, notify };


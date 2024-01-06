
export class EventDispatcher {
  constructor() {
    this.events = [];
    this.eventsOn = true;
  }

  suspendEvent() {
    this.eventsOn = false;
  }

  resumeEvent() {
    this.eventsOn = true;
  }

  on(name, callback, thisObj) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push({
      callback,
      thisObj
    });
  }

  off(name, callback) {
    if (!this.events[name]) return;
    const index = this.events[name].findIndex(e => e.callback === callback);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  offAll() {
    this.events = [];
  }

  async notify(name, ...args) {
    if (!this.eventsOn || !this.events[name]) return;

    for (const evt of this.events[name]) {
      const { callback, thisObj } = evt;
      if (!thisObj) {
        await callback(...args);
      } else {
        await callback.apply(thisObj, args);
      }
    }
  }
}

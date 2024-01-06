export class AsyncLock {
  constructor() {
    this.isLocked = false;
    this.queue = [];
  }
  lock = async function () {
    if (this.isLocked) {
      return new Promise((resolve) => {
        this.queue.push(resolve);
      });
    } else {
      this.isLocked = true;
      return Promise.resolve();
    }
  };
  unlock = function () {
    if (this.queue.length > 0) {
      const nextResolve = this.queue.shift();
      nextResolve();
    } else {
      this.isLocked = false;
    }
  };
}

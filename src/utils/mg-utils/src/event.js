const events = {};
const getCallbacks = name => events[name] || (events[name] = []);

export function on(name, cb, thisObj) {
  const callbacks = getCallbacks(name);
  if (callbacks.some(([_cb, _thisObj]) => _cb === cb && _thisObj === thisObj)) return;
  callbacks.push([cb, thisObj]);
}

export function off(name, cb, thisObj) {
  const callbacks = getCallbacks(name);
  const cbIndex = callbacks.findIndex(([_cb, _thisObj]) => _cb === cb && _thisObj === thisObj);
  if (cbIndex !== -1) {
    callbacks.splice(cbIndex, 1);
  }
}

export async function notify(name, ...args) {
  const callbacks = getCallbacks(name);
  return Promise.all(callbacks.map(([cb, thisObj]) => cb.call(thisObj, ...args)));
}

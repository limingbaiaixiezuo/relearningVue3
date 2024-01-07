const numberRegex = /^-?\d+(?:\.\d+)?$/;

export const isDefine = (val) => val !== undefined && val !== null;

export const isFunction = (val) => val instanceof Function;

export const isObject = (val) => val !== null && typeof val === 'object';

export const isPromise = (val) => isObject(val) && isFunction(val.then) && isFunction(val.catch);

export const isDate = (val) =>
  Object.prototype.toString.call(val) === '[object Date]' &&
 !Number.isNaN(val.getTime());

export const isString = (val) => typeof val === 'string';

export const isNumeric = (val) => typeof val === 'number' || numberRegex.test(val);

export const isArray = (arr) => Object.prototype.toString.call(arr) === '[object Array]';

export const isJSON = (str) => { try { JSON.parse(str); return true; } catch (err) { return false; } };

export const getOS = () => {
  const userAgent = navigator.userAgent;
  let osName = 'Unknown';

  if (userAgent.indexOf('Win') !== -1) {
    osName = 'Win';
  } else if (userAgent.indexOf('Mac') !== -1) {
    osName = 'Mac';
  } else if (userAgent.indexOf('Linux') !== -1) {
    osName = 'Linux';
  } else if (userAgent.indexOf('Android') !== -1) {
    osName = 'Android';
  } else if (userAgent.indexOf('iOS') !== -1) {
    osName = 'iOS';
  }
  return osName;
};

import { isDefine, isObject } from './validate';

/**
 * @description: 深克隆
 * @param {*} obj
 * @return {*}
 */
export function deepClone(obj) {
  if (!isDefine(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  if (isObject(obj)) {
    const to = {};
    Object.keys(obj).forEach((key) => {
      to[key] = deepClone(obj[key]);
    });

    return to;
  }

  return obj;
}

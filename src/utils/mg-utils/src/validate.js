/*
 * @Author: yinmingdi
 * @Date: 2021-11-15 14:40:00
 * @Description:
 *
 */

/**
 * @description: 是否定义
 * @param {*} val
 * @return {*}
 */
export const isDefine = (val) => val !== undefined && val !== null;

/**
 * @description: 是否是函数
 * @param {*} val
 * @return {*}
 */
export const isFunction = (val) => val instanceof Function;

/**
 * @description: 是否是对象
 * @param {*} val
 * @return {*}
 */
export const isObject = (val) => val !== null && typeof val === 'object';

/**
 * @description: 是否是promise
 * @param {*} val
 * @return {*}
 */
export const isPromise = (val) => isObject(val) && isFunction(val.then) && isFunction(val.catch);

/**
 * @description: 是否是日期
 * @param {*} val
 * @return {*}
 */
export const isDate = (val) =>
  Object.prototype.toString.call(val) === '[object Date]' &&
  !Number.isNaN((val).getTime());

/**
 * @description: 是否是数字
 * @param {*} val
 * @return {*}
 */
export const isNumber = (val) => typeof val === 'number' || /^\d+(\.\d+)?$/.test(val);

/**
 * @description: 是否是字符串
 * @param {*} val
 * @return {*}
 */
export const isString = (val) => typeof val === 'string';

/**
 * @description: 是否是浏览器
 * @param {*} val
 * @return {*}
 * **/
export const isBrowser = typeof window !== 'undefined';


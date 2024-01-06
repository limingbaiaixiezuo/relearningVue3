import { isObject } from './validate';

const empty = {};

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function diff(object, base) {
  return Object.entries(base)
    .map(([ k, v ]) =>
      isObject(v) && isObject(object[k])
        ? [ k, diff(v, object[k]) ]
        : object[k] !== v
          ? [ k, v ]
          : [ k, empty ]
    )
    .reduce((acc, [ k, v ]) =>
      v === empty ? acc : { ...acc, [k]: v }
    , empty);
}

/**
 * 根据排序依据,排序k-v顺序
 * @param {Map} map 目标排序k-v 对象
 * @param {function} sortFunc 排序依据
 */
export function sortMap(map = {}, sortFunc = (v1, v2) => v1 - v2) {
  const keys = Object.keys(map);
  const sortkeys = keys.sort(sortFunc);
  const sortMap = {};
  sortkeys.forEach(k => { sortMap[k] = map[k]; });
  map = sortMap;
  return map;
}


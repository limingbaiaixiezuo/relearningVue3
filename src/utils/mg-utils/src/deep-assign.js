/*
 * @Author: yinmingdi
 * @Date: 2021-11-15 14:40:00
 * @Description:
 *
 */
import { isDefine, isObject } from './validate';

const { hasOwnProperty } = Object.prototype;

/**
 * @description: 更具key来合并
 * @param {*} to
 * @param {*} from
 * @param {*} key
 * @return {*}
 */
function assignKey(to, from, key) {
  const val = from[key];

  if (!isDefine(val)) {
    return;
  }

  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    // eslint-disable-next-line no-use-before-define
    to[key] = deepAssign(Object(to[key]), val);
  }
}

/**
 * @description: 深合并
 * @param {*} to
 * @param {*} from
 * @return {*}
 */
export function deepAssign(to, from) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });

  return to;
}

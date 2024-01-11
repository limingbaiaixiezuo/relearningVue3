import { math } from './math';
/**
 * @Author: yinmingdi
 * @Date: 2021-11-15 14:40:00
 * @Description: 格式化函数集
 *
 */

import { isNumber } from './validate';

/**
 * @description: 转为驼峰
 * @param {*} str
 * @return {*}
 */
const camelizeRE = /-(\w)/g;
export const camelize = (str) =>
  str.replace(camelizeRE, (_, c) => c.toUpperCase());

/**
 * @description: 限定范围
 * @param {*} num
 * @param {*} min
 * @param {*} max
 * @return {*}
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * @description: 转换成科学计数法
 * @param {*} num
 * @param {*} fractionDigits
 * @return {*}
 */
export function toExponential(num, fractionDigits) {
  if (!Number.isFinite(num)) return num;
  return Number(num).toExponential(fractionDigits);
}

/**
 * @description: 科学计数法转正常数字
 * @param {*} num
 * @return {*}
 */
export function toNonExponential(num) {
  if (!Number.isFinite(num)) return num;

  const [, decimal = '', fractionDigits] = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  const fixedNum = decimal.length - fractionDigits;
  return num.toFixed(Math.max(0, fixedNum));
}

/**
 * @description: 小数点精确
 * @param {*} num
 * @param {*} pre
 * @return {*}
 */

export function toPrecision(num, pre = 0) {
  if (!Number.isFinite(num)) return num;
  // 解决-1.5 round 到-1的问题
  // round 如果参数的小数部分恰好等于0.5，则舍入到相邻的在正无穷（+∞）方向上的整数
  const isNegative = num < 0;
  if (isNegative) num = -num;
  let floatNum = parseFloat(
    `${Math.round(num * Math.pow(10, pre)) / Math.pow(10, pre)}`
  );
  if (isNegative) floatNum = -floatNum;

  return floatNum;
}

/**
 * @description: 转换为复数
 * @param {*} real
 * @param {*} imag
 * @return {*}
 */
export function toComplexNumber(real, imag = 0) {
  let complexNum = toPrecision(real, 6);
  const precisionImag = toPrecision(imag, 6);

  if (precisionImag) complexNum += `+${precisionImag}i`;

  return complexNum;
}

/**
 * @description: 有效位数下标
 * @param {*} num
 * @return {*}
 */
export function findSFIndex(num) {
  if (!isNumber(num)) return null;
  const result = /[1-9]/.exec(num);
  const index = result ? result.index : result;
  // 算上整数部分的0，再补上下标从0开始
  return index + 2;
}

/**
 * @description: 获得数字各部分
 * @param {*} num
 * @return {*}
 */
export function getNumPart(num) {
  if (!num) return num;
  const normalNum = toNonExponential(num);
  const reg = /[-]?(?<int>\d+)(?:\.(?<decimal>\d+))?/;
  return reg.exec(normalNum).groups;
}

/**
 * @description: 小数点精确与科学记数法
 * 1、若整数位≠0，小数位保留四舍五入的3位，整数位超过4位时采用科学记数法；
 * 2、若整数位=0，有效位数保留四舍五入的3位，若从第4位之后开始为有效位数，则采用科学计数法
 * @param {*} num
 * @param {*} pre 四舍五入的位数
 * @return {*}
 */
export function compositePrecision(num, pre = 3) {
  if (!num || isNaN(num) || !isFinite(num)) return num;

  let value;
  num = Number(num);
  const { int, decimal } = getNumPart(num);
  Number(int) ? resolveInt() : resolveDecimal();

  function resolveInt() {
    if (int.length > pre + 1) {
      value = toExponential(num, pre);
    } else {
      value = toPrecision(num, pre);
    }
  }

  function resolveDecimal() {
    // 注意下标从0开始
    const SFIndex = findSFIndex(decimal);
    if (SFIndex > pre) {
      value = toExponential(num, pre);
    } else {
      value = toPrecision(num, pre);
    }
  }

  return value;
}

/**
 * @description: 数列精确
 * @param {Array} nums 数列
 * @return {Object}
 */
export function seriesNumPrecision(nums, disabledAbs = false) {
  if (!nums || !nums.length) return nums;
  const multiple = 100;
  const absNums = nums.map(num => Math.abs(num));
  const maxNum = disabledAbs ? Math.max(...nums) : Math.max(...absNums);
  const formateNums = [];
  const cache = {};
  const maxNumInfo = getMaxNumInfo(maxNum);

  function getMaxNumInfo(maNum) {
    const precisionNum = compositePrecision(maNum, 2);
    const reg = /(?<num>[+-]?\d+(?:\.\d+)?)(e(?<symbol>[+-])(?<expo>\d+))?/;
    const { groups } = reg.exec(precisionNum);
    return groups;
  }

  function numsPrecision(num, index, precision) {
    let precisionNum;
    const thanNum = disabledAbs ? num : Math.abs(num);
    // 数字的绝对值与最大值相差一百倍，为零
    if (maxNum / multiple > thanNum) {
      formateNums[index] = 0;
      return;
    };

    // 最大值是科学计数法
    if (maxNumInfo.expo) {
      const expoMultiple = Math.pow(10, maxNumInfo.expo);
      const resultNum = maxNumInfo.symbol === '+'
        ? math.divide(num, expoMultiple)
        : math.multiply(num, expoMultiple);
      precisionNum = toPrecision(resultNum, precision);
    } else {
      precisionNum = toPrecision(num, precision);
    }

    // 已存在继续递归比较
    const cacheInfo = cache[precisionNum];
    if (cacheInfo) {
      if (num > cacheInfo.num) {
        cache[precisionNum] = { index, num };
        numsPrecision(cacheInfo.num, cacheInfo.index, precision + 1);
      }
      numsPrecision(num, index, precision + 1);
    } else {
      cache[precisionNum] = { index, num };
      formateNums[index] = precisionNum;
    }
  }

  nums.forEach((num, index) => numsPrecision(num, index, 2));

  return {
    formateNums,
    exponential: maxNumInfo.expo ? maxNumInfo.symbol + maxNumInfo.expo : undefined
  };
}

/**
 * @description: 时间戳格式化 yyyy-MM-dd hh:mm:ss
 * @param {Date} dateInput 转化时间
 * @return {String} 格式化后的时间
 */
export function dateFormat(dateInput) {
  const [year, month, day, hour, minute, second] = [
    dateInput.getFullYear(),
    dateInput.getMonth() + 1,
    dateInput.getDate(),
    dateInput.getHours(),
    dateInput.getMinutes(),
    dateInput.getSeconds()
  ];
  // 补0
  const addZero = (item) => {
    if (item < 10) {
      item = '0' + item;
    }
    return item;
  };
  return year + '-' + addZero(month) + '-' + addZero(day) + ' ' + addZero(hour) + ':' + addZero(minute) + ':' + addZero(second);
}

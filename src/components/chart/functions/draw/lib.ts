/**
 * @desc  科学计数法
 * @name SN --- scientific notation
 * @param  value---目标数字 number 类型
 * @param  fractionDigits ---- 0 到 20
 * @param  long---科学计数法e前面的字符个数
 **/

import enCustom from '../../config/languages/en.json';
import znCustom from '../../config/languages/zn.json';
import { db } from '../dataBase';
import { cloneJSON } from '../ui';

const toSN = (value: number, fractionDigits: number = 6) => {
  if (typeof value !== 'number') {
    return 'NaN';
  }
  // eslint-disable-next-line no-new-wrappers
  return new Number(value).toExponential(fractionDigits);
  // return new Number(value).toExponential();
};

// eslint-disable-next-line no-unused-vars
const fixedE = (num: { toString: () => any; }, pre = 2) => { // 科学计数法指定精度
  const res = num.toString();
  const long = pre + 1 + 1; // . 和 slice 规则限制
  let t1 = 1;
  let num1 = 0; // e 前面的字符个数
  for (let k = 0; k < res.length; k++) {
    if (res[k] === 'e') { t1 = 0; }
    if (t1) { num1++; }
  }
  if (num1 > long) { // 1.11e-1212
    return res.slice(0, long) + res.slice(num1);
  } else {
    return num;
  }
};

// eslint-disable-next-line no-unused-vars
const getStr = (v: { toString: () => string | any[]; }, long = 4) => {
  const result = v.toString().slice(0, long);
  return result;
};

const toSN33 = (value: number) => {
  if (value === 0) {
    return '0';
    // 检查是否已经转化为科学计数了
  } else if (value.toString().split('').length < 5) {
    return value.toString();
  } else {
    return Number(value.toPrecision(2)).toExponential(1);
  }
};

const toSN222 = (value: string | number) => {
  const res = Number(value.toPrecision(2)).toExponential(3);
  let numN1 = 0;
  let numN2 = 1;
  let num1 = 0;
  let num2 = 0;
  let t1 = 1;
  for (let k = 0; k < res.length; k++) {
    if (res[k] === '.') { t1 = 0; }
    if (t1) { num1++; } else { num2++; }
  }

  if (Math.abs(value) < 1 && res.length > 4) {
    for (let i = 2; i < res.length; i++) {
      if (res[i] === '0') {
        numN2++;
      } else if (res[i] === '.') { continue; } else { break; }
    }
    let v = parseFloat(value);
    v = v * Math.pow(10, numN2);
    return v.toString() + 'e-' + numN2;
  } else if (num1 > 4) {
    if (res[0] === '-') { numN1 = num1 - 2; } else { numN1 = num1 - 1; }
    let v = parseFloat(value);
    v = v / Math.pow(10, numN1);
    if (num2 > 4) { v = v.toFixed(4); }
    return v.toString() + 'e' + numN1;
  } else { return parseFloat(value); }
};

const filterMatrix = (matrix: Array<Array<number>>, range: boolean, xMin: number, xMax: number): Array<Array<number>> => {
  return matrix.map(arr => {
    return arr.filter(
      (i: number) =>
        !range ||
                (i >= xMin && i <= xMax) ||
                xMin === undefined ||
                xMax === undefined
    );
  });
};

const LangF = (str: string) => {
  let right = '';
  if (str.slice(0, 5) === 'Sweep') {
    // str = "Sweep"
  } else if (str.slice(0, 10) === 'Wavelength') {
    right = str.slice(10, str.length);
    str = 'Wavelength';
  } else if (str.slice(0, 9) === 'Frequency') {
    right = str.slice(9, str.length);
    str = 'Frequency';
  } else if (str.slice(0, 4) === 'Mode') {
    right = str.slice(4, str.length);
    str = 'Mode';
  } else if (str.slice(0, 10) === 'X Position') {
    right = str.slice(10, str.length);
    str = 'X Position';
  } else if (str.slice(0, 10) === 'Y Position') {
    right = str.slice(10, str.length);
    str = 'Y Position';
  } else if (str.slice(0, 10) === 'Z Position') {
    right = str.slice(10, str.length);
    str = 'Z Position';
  } else if (str.slice(0, 4) === 'Time') {
    right = str.slice(4, str.length);
    str = 'Time';
  }

  const Lang: any = db.langName === 'zh-cn' ? znCustom.visualizer : enCustom.visualizer;

  if (Lang[str] !== undefined) {
    return `${Lang[str]}${right}`;
  } else {
    return `${str}${right}`;
  }
};

const LangOption = (arr: any) => {
  const options = cloneJSON(arr);
  const Lang: any = db.langName === 'zh-cn' ? znCustom.visualizer : enCustom.visualizer;

  return options.map((a: { label: string | number; }) => {
    if (Lang[a.label] !== undefined) {
      a.label = Lang[a.label];
    }
    return a;
  });
};

export {
  toSN,
  toSN222,
  toSN33,
  filterMatrix,
  LangF,
  LangOption
};

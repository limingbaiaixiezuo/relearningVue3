
// eslint-disable-next-line no-unused-vars
function cloneForce(x) {
  const uniqueList = []; // 用来去重

  const root = {};

  // 循环数组
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x
    }
  ];

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = {};
    }
    // 数据已经存在
    const uniqueData = find(uniqueList, data);
    if (uniqueData) {
      parent[key] = uniqueData.target;
      break; // 中断本次循环
    }
    // 数据不存在
    // 保存源数据，在拷贝数据中对应的引用
    uniqueList.push({
      source: data,
      target: res
    });

    for (const k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k]
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }

  return root;
}

function find(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i];
    }
  }

  return null;
}

// eslint-disable-next-line no-unused-vars
function shallowClone(source) {
  var target = {};
  for (var i in source) {
    if (source.hasOwnProperty(i)) {
      target[i] = source[i];
    }
  }
  return target;
}

function cloneJSON(source) {
  try {
    return JSON.parse(JSON.stringify(source));
  } catch (err) {
    console.log(err);
  }
  return deepClone(source);
}

// eslint-disable-next-line no-unused-vars
function createData(deep, breadth) {
  var data = {};
  var temp = data;
  for (var i = 0; i < deep; i++) {
    temp = temp['data'] = {};
    for (var j = 0; j < breadth; j++) {
      temp[j] = j;
    }
  }
  return data;
}

function deepClone(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  let copy = {};
  if (obj.constructor === Array) {
    copy = [];
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepClone(obj[key]);
    }
  }
  return copy;
}

function objToArray(obj, deepClone) {
  const arr = [];
  let target = obj;
  if (deepClone) {
    target = cloneJSON(obj);
  }
  for (const [key, value] of Object.entries(target)) {
    arr.push({ [key]: value });
  }
  return arr;
}

function arrToObject(arr) {
  const obj = {};
  arr.forEach((i) => {
    obj[Object.keys(i)] = Object.values(i)[0];
  });
  return obj;
}

function sortArrayByArr(target, arr) {
  const result = [];
  arr.forEach((i) => {
    target.forEach((e) => {
      if (i === Object.keys(e)[0]) {
        result.push(e);
      }
    });
  });
  return result;
}

function objectAddKey(obj, name = 'name', value = 'value') {
  return { [name]: Object.keys(obj)[0], [value]: Object.values(obj)[0] };
}

/**
 * @desc  函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param  func 需要执行的函数
 * @param  wait 延迟执行时间（毫秒）
 * @param  immediate---true 表立即执行，false 表非立即执行
 **/
function debounce(func, wait, immediate) {
  let timer;

  return function() {
    const context = this;
    const args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    }
  };
}
// function handle () {
//   console.log(Math.random())
// }

// window.addEventListener('resize', debounce(handle, 1000, true))

function throttle(fn, wait) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
}

// function handle (){
//   console.log(Math.random());
// }

// window.addEventListener("mousemove", throttle(handle, 1000));

function getStrWidth(str, fontSize) {
  let width = 0;
  const node = document.createElement('span');
  node.style.fontSize = fontSize;
  node.innerText = str;
  node.className = 'getTextWidth';
  document.querySelector('body').appendChild(node);
  width = document.querySelector('.getTextWidth').offsetWidth;
  document.querySelector('.getTextWidth').remove();
  return width;
}

function rotate(dom, deg) {
  dom.style.transform = `rotate(${deg}deg)`;
  dom.style.transformOrigin = `${dom.style.offsetWidth / 2} ${dom.style.offsetHeight / 2}`;
}

/**
 * 创建并下载文件
 * @param  {String} fileName 文件名
 * @param  {String} content  文件内容
 */
function createAndDownloadFile(fileName, content) {
  var aTag = document.createElement('a');
  var blob = new Blob([content]);
  aTag.download = fileName;
  aTag.href = URL.createObjectURL(blob);
  aTag.click();
  URL.revokeObjectURL(blob);
}

const removeSpace = (s) => {
  // return s && s.trim().replace(/(^\s+)|(\s+$)|\s+/g, '_')
  return s && s.trim();
};

const isValidated = (s) => {
  // eslint-disable-next-line no-useless-escape
  const regExp = new RegExp('[^a-zA-Z0-9\ \,\.\，\。\_\u4e00-\u9fa5]', 'i'); // 数字 大小写字母 空格 下划线 中文 中英文逗号句号 非特殊字符的基本字符
  // eslint-disable-next-line no-useless-escape
  // let regExp = new RegExp('[^a-zA-Z0-9\ \-\(\)\（\）\,\.\，\。\_\u4e00-\u9fa5]|$[^a-zA-Z\u4e00-\u9fa5]', 'i')
  return !regExp.test(s);
};

const getOptions = (arr) => { // 根据数组数据，生成 element ui select 组件所需要的 option数据
  return arr.map((i, index) => {
    return {
      value: index,
      label: i
    };
  });
};

const getSelectOptions = (arr, skip = null) => { // 根据数据维度数据，生成 element ui select 组件所需要的 option数据 value === label
  let result = arr.map((i, index) => {
    let label = i;
    if (label === 'X') { label = 'x position'; };
    if (label === 'Y') { label = 'y position'; };
    if (label === 'Z') { label = 'z position'; };

    return {
      value: label,
      label: label
    };
  });
  if (skip) {
    result = result.filter((i) => i.label !== skip);
  }
  return result;
};

/**
 * 一维数组变二维矩阵
 * @param  {Array} arr 待分割数组
 * @param  {Number} step 子数组长度
 */
function arrayToMatrix(arr, step) {
  const matrix = [];
  const target = [...arr];
  while (target.length) {
    matrix.push(target.splice(0, Math.floor(step)));
  }
  return matrix;
}

// 利用哈希表，解决循环引用
// 设置一个数组或者哈希表存储已拷贝过的对象，当检测到当前对象已存在于哈希表中时，取出该值并返回即
function cloneDeep3(source, hash = new WeakMap()) {
  const isObject = (obj) => typeof obj === 'object' && obj != null;
  if (!isObject(source)) {
    return source;
  }
  if (hash.has(source)) {
    return hash.get(source); // 新增代码，查哈希表
  }
  var target = Array.isArray(source) ? [] : {};
  hash.set(source, target); // 新增代码，哈希表设值
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep3(source[key], hash); // 新增代码，传入哈希表
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

const isEmpty = (obj) => {
  for (const i in obj) {
    return false;
  }
  return true;
};

function shallowFlatten(arr) {
  return arr.reduce((a, b) => a.concat(b), []);
}

function flatten(arr, n = 1) {
  let result = arr;
  while (n--) {
    result = shallowFlatten(result);
  }
  return result;
}

/**
 * @param  {Date} dateInput 需要格式话的日期
*/
function dateFormat(dateInput) {
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

const minMax = (array) => {
  if (array === undefined) return [null, null];
  if (array.length < 2) return [array[0], array[0]];
  let min = array[0]; let max = array[0];

  for (let i = 1; i < array.length; i++) {
    const value = array[i];
    min = (value < min) ? value : min;
    max = (value > max) ? value : max;
  }

  return [min, max];
};

export {
  cloneDeep3,
  rotate,
  throttle,
  debounce,
  deepClone,
  cloneJSON,
  objToArray,
  arrToObject,
  sortArrayByArr,
  objectAddKey,
  getStrWidth,
  createAndDownloadFile,
  removeSpace,
  isValidated,
  getOptions,
  getSelectOptions,
  arrayToMatrix,
  isEmpty,
  flatten,
  dateFormat,
  minMax
};

export * from './localStore';
export * from './props';
export * from './bem';
export * from './mount';
export * from './crypto';
export * from './with-install';
export * from './object';
export * from './gzip';
export * from './resource';
export * from './asyncLock';
export * from './search';
// export function createNamespace(name, noPrefix = false) {
//   const prefixName = noPrefix ? name : `o-${name}`;
//   return [
//     prefixName,
//     createBEM(prefixName)
//   ];
// }

// function genBem(name, mods) {
//   if (!mods) {
//     return '';
//   }

//   if (typeof mods === 'string') {
//     return ` ${name}--${mods}`;
//   }

//   if (Array.isArray(mods)) {
//     return mods.reduce((ret, item) => ret + genBem(name, item), '');
//   }

//   return Object.keys(mods).reduce(
//     (ret, key) => ret + (mods[key] ? genBem(name, key) : ''),
//     ''
//   );
// }
// export function createBEM(name) {
//   return (el, mods) => {
//     if (el && typeof el !== 'string') {
//       mods = el;
//       el = '';
//     }

//     el = el ? `${name}__${el}` : name;

//     return `${el}${genBem(el, mods)}`;
//   };
// }

export function pick(obj, keys, ignoreUndefined) {
  return keys.reduce((acc, key) => {
    if (!ignoreUndefined || obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

export const extend = Object.assign;

export const inBrowser = typeof window !== 'undefined';

export function getZIndexStyle(zIndex) {
    const style = {};
    if (zIndex !== undefined) {
      style.zIndex = +zIndex;
    }
    return style;
}

export function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}


export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// range 是spread的range
export function mapRange(range, fn, beforeFn) {
  for (let i = 0; i < range.colCount; i++) {
    const col = range.col + i;
    const beforeData = beforeFn?.(col);

    for (let j = 0; j < range.rowCount; j++) {
      const fnParams = {
        row: range.row + j,
        rowOffset: j,
        col: range.col + i,
        colOffset: i
      };

      beforeData ? fn(fnParams) : fn(fnParams, beforeData);
    }
  }
}

export const intersection = (a, b) => {
  const s = new Set(b);
  return [...new Set(a)].filter(x => s.has(x));
};

export const union = (a, b) => {
  return [...new Set([...a, ...b])];
};

export function addUnit(value) {
  if (isDefine(value)) {
    return isNumeric(value) ? `${value}px` : String(value);
  }
  return undefined;
}


export function createId() {
  return (((1000000 + Math.random()) * 10000)).toString(16).substring(1);
}

export function debounce (callback, delay) {
  return function (...arg) {
    clearTimeout(callback.id);
    callback.id = setTimeout(() => {
      callback.call(this, ...arg);
    }, delay);
    return callback.id;
  };
}

export const copyToShearPlat = (value) => {
  return new Promise((resolve) => {
    const textarea = document.createElement('textarea');
    textarea.readOnly = 'readonly';
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    document.execCommand('Copy');
    document.body.removeChild(textarea);
    resolve();
  });
};

export const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage;
  return lang === 'zh-CN' ? 'zh' : 'en';
};

export const convertValuesMappingIdxToId = (rows, fields, values) => {
  const valueObj = {};
  Object.entries(values).forEach(([rowIndex, rowValues]) => {
    const rowId = rows[rowIndex].id;
    const rowValueObj = {};
    Object.entries(rowValues).forEach(([fieldIndex, cellValue]) => {
      const fieldId = fields[fieldIndex].id;
      rowValueObj[fieldId] = cellValue;
    });
    valueObj[rowId] = rowValueObj;
  });
  return valueObj;
};


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

export function getSizeStyle(
  originSize
) {
  if (isDefine(originSize)) {
    if (Array.isArray(originSize)) {
      return {
        width: addUnit(originSize[0]),
        height: addUnit(originSize[1])
      };
    }
    const size = addUnit(originSize);
    return {
      width: size,
      height: size
    };
  }
}

function assignKey(to, from, key, ignoreUndefined) {
  const val = from[key];

  if (!isDefine(val)) {
    if (ignoreUndefined) {
      to[key] = val;
    }
    return;
  }

  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    // eslint-disable-next-line no-use-before-define
    to[key] = deepAssign(Object(to[key]), val);
  }
}

export function deepAssign(to, from, ignoreUndefined = false) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key, ignoreUndefined);
  });

  return to;
}



export function callInterceptor(
    interceptor,
    {args = [], done, canceled}
  ) {
    if (interceptor) {
      const result = interceptor.apply(null, args);
  
      if (isPromise(result)) {
        result.then(value => {
          if (value) {
            done();
          } else if (canceled) {
            canceled();
          }
        }).catch(() => {});
      } else if (result) {
        done();
      } else if (canceled) {
        canceled();
      }
    } else {
      done();
    }
  }

  export function deepClone(obj) {
    if (!isDefine(obj)) return obj;
  
    if (Array.isArray(obj)) {
      return obj.map(item => deepClone(item));
    }
  
    if (obj instanceof Set) {
      return new Set(JSON.parse(JSON.stringify([...obj])));
    } else if (obj instanceof Map) {
      return new Map(JSON.parse(JSON.stringify([...obj])));
    }
  
    if (isObject(obj)) {
      const to = {};
      for (const key in obj) {
        to[key] = deepClone(obj[key]);
      }
  
      return to;
    }
  
    return obj;
  }
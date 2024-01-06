import { isDefine, isObject } from './validate';

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

// function testDeepClone(obj, clones = new WeakMap()) {
//   // 如果对象是原始值或null，则直接返回
//   if (!isDefine(obj) || typeof obj !== 'object') {
//     return obj;
//   }

//   // 如果对象已经被克隆过，直接返回克隆的对象，以避免循环引用
//   if (clones.has(obj)) {
//     return clones.get(obj);
//   }

//   // 根据对象的类型创建一个新的空对象或数组
//   const newObj = Array.isArray(obj) ? [] : typeof obj === 'object' ? {} : obj;

//   // 将新对象添加到克隆映射中
//   clones.set(obj, newObj);

//   if (obj instanceof Set) {
//     // 处理Set对象
//     obj.forEach((value) => {
//       newObj.add(deepClone(value, clones));
//     });
//   } else if (obj instanceof Map) {
//     // 处理Map对象
//     obj.forEach((value, key) => {
//       newObj.set(key, deepClone(value, clones));
//     });
//   } else {
//     // 处理普通对象或数组
//     for (const key in obj) {
//       if (Object.prototype.hasOwnProperty.call(obj, key)) {
//         newObj[key] = deepClone(obj[key], clones);
//       }
//     }
//   }

//   return newObj;
// }


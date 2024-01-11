/*
 * @Author: yinmingdi
 * @Date: 2022-03-04 18:12:46
 * @Description: 创建函数工具
 *
 */

/**
 * @description: 生成命名空间
 * @param {*} name
 * @param {*} mods
 * @return {*}
 */
function genBem(name, mods) {
  if (!mods) return '';
  if (typeof mods === 'string') {
    return ` ${name}--${mods}`;
  }

  if (Array.isArray(mods)) {
    return mods.reduce((ret, item) => ret + genBem(name, item), '');
  }

  return Object.keys(mods).reduce(
    (ret, key) => ret + (mods[key] ? genBem(name, key) : ''),
    ''
  );
}

/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */
export function createBEM(name) {
  return (el, mods) => {
    if (el && typeof el !== 'string') {
      mods = el;
      el = '';
    }
    el = el ? `${name}_${el}` : name;

    return `${el}${genBem(el, mods)}`;
  };
}

/**
 * @description: 创建命名空间
 * @param {*} name
 * @return {*}
 */
export function createNameSpace(name, disabledPrefix = false) {
  const prefixName = disabledPrefix ? `${name}` : `an-${name}`;
  return [
    prefixName,
    createBEM(prefixName)
    // createTranslate(prefixName)
  ];
}

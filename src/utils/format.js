import { isDefine, isNumeric } from './validate';

export function getZIndexStyle(zIndex) {
  const style = {};
  if (zIndex !== undefined) {
    style.zIndex = +zIndex;
  }
  return style;
}

export const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
};

export function addUnit(value) {
  if (isDefine(value)) {
    return isNumeric(value) ? `${value}px` : String(value);
  }
  return undefined;
}

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


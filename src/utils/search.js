export const search = (keyword, array) => {
  if (!keyword && keyword !== 0) {
    return;
  }
  const isChinese = /[\u4e00-\u9fa5]/.test(keyword);
  let pattern = null;
  if (isChinese) {
    const chineseChars = keyword.split('');
    const chinesePattern = chineseChars.map((char) => `[${char}]`).join('');
    pattern = new RegExp(chinesePattern, 'i');
  } else {
    const sanitizedKeyword = keyword.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    pattern = new RegExp(sanitizedKeyword, 'i');
  }
  return array.filter(item => pattern.test(item.name));
};

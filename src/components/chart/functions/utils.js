
export const capitalize = (str, onlyFirst = false) => {
  if (str === undefined || str === '') {
    return '';
  }
  if (onlyFirst) {
    return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
  }
  return str.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
};

export const isSpecialUnit = (name) => {
  return name.slice(0, 5) === 'sweep' ||
        name.slice(0, 5) === 'Sweep' ||
        name === 'mode' ||
        name === 'Mode' || name === 'Mode' || name.slice(0, 10) === 'Group span';
};

export const calcXAxisNum = (size, len) => { // Line: size = WIDTH* 0.78 / WIDTH*0.92  seg = num -1
  let number = 6;
  if (size < 150) {
    number = 2;
  } else if (size < 200 && size >= 150) {
    number = 3;
  } else if (size >= 200 && size < 300) {
    number = 4;
  } else if (size >= 300 && size < 400) {
    number = 5;
  } else if (size >= 400 && size < 500) {
    number = 6;
  } else if (size >= 500 && size < 600) {
    number = 8;
  } else if (size >= 600 && size < 700) {
    number = 10;
  } else if (size >= 700 && size < 800) {
    number = 12;
  } else if (size >= 800 && size < 900) {
    number = 14;
  } else if (size >= 900 && size < 1000) {
    number = 16;
  } else {
    number = 18;
  }
  number = len < number ? len : number;
  number = number < 2 ? 2 : number;
  return number;
};

export const calcYAxisNum = (size, len) => { // Line：size = HEIGHT* 0.7   seg = num -1
  let number = 6;
  if (size < 100) {
    number = 2;
  } else if (size < 200 && size >= 100) {
    number = 4;
  } else if (size >= 200 && size < 300) {
    number = 6;
  } else if (size >= 300 && size < 400) {
    number = 8;
  } else if (size >= 400 && size < 500) {
    number = 12;
  } else if (size >= 500 && size < 600) {
    number = 16;
  } else if (size >= 600 && size < 700) {
    number = 18;
  } else if (size >= 700 && size < 800) {
    number = 22;
  } else if (size >= 800 && size < 900) {
    number = 26;
  } else if (size >= 900 && size < 1000) {
    number = 30;
  } else {
    number = 34;
  }

  number = len < number ? len : number;
  number = number < 2 ? 2 : number;

  return number;
};

export const genAxisLabels = (mode = false, num, axisData, min, max) => {
  if (axisData.length <= num || mode && axisData.length <= 10) {
    return axisData.sort((a, b) => a - b);
  }

  const labels = [];
  const seg = num - 1;
  const interval = (max - min) / seg;

  for (let i = 0; i < seg; i++) {
    labels.push(min + i * interval);
  }

  labels.push(max);
  return labels;
};

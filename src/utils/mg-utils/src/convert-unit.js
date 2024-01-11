import { math } from '../index';

// 长度单位
export const LengthUnit = {
  nanometers: 'nm',
  micros: 'μm', // default
  mm: 'mm',
  cm: 'cm',
  meters: 'm'
};

// 时间单位
export const TimeUnit = {
  femtoseconds: 'fs', // default
  picoseconds: 'ps',
  nanoseconds: 'ns',
  microseconds: 'μs',
  milliseconds: 'ms',
  seconds: 's'
};

// 频率单位
export const FrequencyUnit = {
  hertz: 'Hz',
  kilohertz: 'KHz',
  megahertz: 'MHz',
  gigahertz: 'GHz',
  terahertz: 'THz', // default
  inverse_cm: 'cm-1'
};

// 耗损单位
export const LossUnit = {
  dB_per_micron: 'dB/μm',
  dB_per_mm: 'dB/mm',
  dB_per_cm: 'dB/cm', // default
  dB_per_meter: 'dB/m',
  dB_per_km: 'dB/km'
};

// 电导率单位
export const ConductivityUnit = {
  siemens: 'S',
  millisiemens: 'mS',
  microsiemens: 'μS' // default
};

// 电阻率单位
// export const ResistivityUnit = {
//   milliohms: 'mΩ',
//   microohms: 'μΩ', // default
//   ohms: 'Ω'
// };

// 光速
const LIGHT_SPEED = 299792458; // m/s

// 耗损公式(弗里斯传输公式): Los(dB) = 32.44 + 20lg d(Km) + 20lg f(MHz)

// 相关单位比率关系
const convertRouter = [
  { unit: LengthUnit, rate: [1e9, 1e6, 1e3, 1e2, 1] },
  { unit: TimeUnit, rate: [1e15, 1e12, 1e9, 1e6, 1e3, 1] },
  { unit: FrequencyUnit, rate: [1e12, 1e9, 1e6, 1e3, 1, 1e12 / math.multiply(LIGHT_SPEED, 1e2)] },
  { unit: LossUnit, rate: [1e9, 1e6, 1e5, 1e3, 1] },
  { unit: ConductivityUnit, rate: [1e6, 1e3, 1] }
  // { unit: ResistivityUnit, rate: [1e6, 1e3, 1] }
];

/**
 * @description: 获取默认单位
 * @return {*}
 */
export function getDefaultUtils() {
  return {
    length: LengthUnit.micros,
    time: TimeUnit.femtoseconds,
    frequency: FrequencyUnit.terahertz,
    loss: LossUnit.dB_per_cm,
    conductivity: ConductivityUnit.microsiemens
    // resistivity: ResistivityUnit.microohms
  };
}

/**
 * @description: 单位换算
 * @param {*} sourceValue
 * @param {*} sourceUnit
 * @param {*} targetUnit
 * @return {*}
 */
export function convertUnit(sourceValue, sourceUnit, targetUnit) {
  if (sourceValue === undefined || sourceValue === null || sourceValue === '') {
    return sourceValue;
  }
  const srcIndex = convertRouter.findIndex(v => Object.values(v.unit).indexOf(sourceUnit) >= 0);
  const dstIndex = convertRouter.findIndex(v => Object.values(v.unit).indexOf(targetUnit) >= 0);

  if (srcIndex < 0 || dstIndex < 0) {
    console.error(`error: Not Support Unit, from ${sourceUnit} to ${targetUnit}.`);
    return 0;
  }

  if (srcIndex !== dstIndex) {
    console.error(`error: Different Unit, from ${sourceUnit} to ${targetUnit}.`);
    return 0;
  }

  const { unit, rate } = convertRouter[srcIndex];
  const srcRateIndex = Object.values(unit).indexOf(sourceUnit);
  const dstRateIndex = Object.values(unit).indexOf(targetUnit);
  // if (sourceUnit.indexOf('dB/') >= 0) {
  //   // convert Loss Unit
  //   return math.add(sourceValue, math.multiply(20, math.sub(rate[dstRateIndex], rate[srcRateIndex])));
  // } else {
  // other
  return math.multiply(sourceValue, math.divide(rate[dstRateIndex], rate[srcRateIndex]));
  // }
}

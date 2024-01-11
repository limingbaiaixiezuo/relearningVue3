
import { isSpecialUnit } from '../../utils';
import { LangF } from '../lib';

export const getXName = (xAxis: any, xMaxE: number) => {
  const xName = xAxis?.name ?? '';
  const xNameSlice = xName.slice(0, xName.length - 1);
  let xNAME = Math.abs(xMaxE) > 1 ? `${LangF(xNameSlice)} x10^${xMaxE})` : Math.abs(xMaxE) === 1 ? `${LangF(xNameSlice)} x10)` : `${LangF(xName)}`;

  if (isSpecialUnit(xName)) {
    xNAME = Math.abs(xMaxE) > 1 ? `${LangF(xName)} (x10^${xMaxE})` : Math.abs(xMaxE) === 1 ? `${LangF(xName)} (x10)` : `${LangF(xName)}`;
  }

  if (xName === 'Mode' || xName === 'mode' || xName.slice(0, 5) === 'Sweep' || xName.slice(0, 5) === 'sweep') {
    xNAME = `${LangF(xName)}`;
  }

  return xNAME;
};

export const getYName = (yAxis: any, yMaxE: number) => {
  const yName = yAxis?.name ?? '';
  const yUnit = yAxis?.unit ? `${yAxis?.unit} ` : '';
  const YUNIT = yUnit.length ? `(${yUnit})` : '';
  let yNAME = '';
  if (yName.length) {
    yNAME = Math.abs(yMaxE) > 1 ? `${LangF(yName)} (${yUnit}x10^${yMaxE})` : Math.abs(yMaxE) === 1 ? `${LangF(yName)} (${yUnit}x10)` : `${LangF(yName)} ${YUNIT}`;
  } else if (isSpecialUnit(yName)) {
    yNAME = Math.abs(yMaxE) > 1 ? `${LangF(yName)} (${yUnit}x10^${yMaxE})` : Math.abs(yMaxE) === 1 ? `${LangF(yName)} (${yUnit}x10)` : `${LangF(yName)}  ${YUNIT}`;
  } else {
    yNAME = Math.abs(yMaxE) > 1 ? `(${yUnit}x10^${yMaxE})` : Math.abs(yMaxE) === 1 ? `(${yUnit}x10)` : `${YUNIT}`;
  }

  if (yName === 'Mode' || yName === 'mode' || yName.slice(0, 5) === 'Sweep' || yName.slice(0, 5) === 'sweep') {
    yNAME = `${LangF(yName)}`;
  }

  return yNAME;
};

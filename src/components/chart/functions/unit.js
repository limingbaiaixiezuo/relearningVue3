import { db } from './dataBase';
import { cloneJSON } from './ui';
import { isSpecialUnit } from './utils';
import { capitalize } from './utils.js';

export const disallowUnitConversion = (source, config, type) => {
  if (type === 'multiLine') {
    const x = source.option.dataset.xAxis.data;
    db.baseUnitDB.line.x = x;
    const xName = capitalize(source.option.dataset.xAxis.name, true);

    const unit = config.option.dataset.xAxis.unit;
    db.viewData.line.unitX = unit;
    const newXName = isSpecialUnit(xName) ? `${xName}` : `${xName} (${unit})`;
    config.option.dataset.xAxis.name = newXName;
  }

  if (type === 'intensity') {
    if (
      (source.resultType &&
            (source.resultType === 'emeSMATRIX' ||
                source.resultType === 'FDTDSMatrixIntensity')) ||
        source.resultType === 'emeParamsSWEEP_Image'
    ) {
      config.option.dataset.xAxis.name = '';
      config.option.dataset.yAxis.name = '';
      return config;
    }
    const x = source.option.dataset.xAxis.data;
    const xName = capitalize(source.option.dataset.xAxis.name, true);
    const xUnit = source.option.dataset.xAxis.unit;

    const y = source.option.dataset.yAxis.data;

    const yName = capitalize(source.option.dataset.yAxis.name, true);
    const yUnit = source.option.dataset.yAxis.unit;
    const { customRange } = source.option.dataset;
    const { xMin, xMax, yMin, yMax } = customRange ?? {};
    db.baseUnitDB.intensity.x = x;
    db.baseUnitDB.intensity.y = y;

    db.viewData.image.pureX =
        xMin === undefined || xMax === undefined
          ? x
          : x.filter((x, index) => x >= xMin).filter((x, index) => x <= xMax);

    db.viewData.image.pureY =
        yMin === undefined || yMax === undefined
          ? y
          : y.filter((y, index) => y >= yMin).filter((y, index) => y <= yMax);

    if (xName === undefined) {
      config.option.dataset.xAxis.name = '';
    } else {
      config.option.dataset.xAxis.name = isSpecialUnit(xName)
        ? `${xName}`
        : `${xName} (${xUnit})`;
    }

    if (yName === undefined) {
      config.option.dataset.yAxis.name = '';
    } else {
      config.option.dataset.yAxis.name = isSpecialUnit(yName)
        ? `${yName}`
        : `${yName} (${yUnit})`;
    }
  }
  return config;
};

export const convertUnitByValue = (source, unitObj) => {
  const unitConversion = source.unitConversion ?? true;

  const config = cloneJSON(source);

  const type = source.type;
  if (!unitConversion) {
    return disallowUnitConversion(source, config, type);
  }

  const {
    baseUnit,
    currentUnit,
    convertUnit,
    fBaseUnit,
    fCurrentUnit,
    fConvertUnit,
    TBaseUnit,
    TCurrentUnit
  } = unitObj;

  if (type === 'multiLine') {
    const x = source.option.dataset.xAxis.data;
    db.baseUnitDB.line.x = x;
    const xName = capitalize(source.option.dataset.xAxis.name, true);

    config.option.dataset.xAxis.data = x.map((arr, index) => {
      return arr.map((i) => {
        return xName.slice(0, 9) === 'Frequency' ||
                xName.slice(0, 9) === 'frequency'
          ? convertUnit(i, fBaseUnit.value, fCurrentUnit.value)
          : xName.slice(0, 4) === 'Time' || xName.slice(0, 4) === 'time'
            ? convertUnit(i, TBaseUnit.value, TCurrentUnit.value)
            : convertUnit(i, baseUnit.value, currentUnit.value);
      });
    });

    const unit = config.option.dataset.xAxis.unit;
    const newXName = isSpecialUnit(xName)
      ? `${xName}`
      : unit && (unit === 'THz' || unit === 'MHz')
        ? `${xName} (${fCurrentUnit.value})`
        : unit && (unit === 'ms' || unit === 'fs')
          ? `${xName} (${TCurrentUnit.value})`
          : `${xName} (${currentUnit.value})`;

    db.viewData.line.unitX = isSpecialUnit(xName)
      ? ''
      : unit && (unit === 'THz' || unit === 'MHz')
        ? `${fCurrentUnit.value}`
        : unit && (unit === 'ms' || unit === 'fs')
          ? `${TCurrentUnit.value}`
          : `${currentUnit.value}`;

    config.option.dataset.xAxis.name = newXName;
    const scatter = source.option.dataset?.scatter;
    if (scatter && scatter.data.length) {
      const unit = scatter.unit;

      config.option.dataset.scatter.data = scatter.data.map((i) => {
        return [
          scatter.unit && (scatter.unit === 'THz' || unit === 'MHz')
            ? fConvertUnit(i, fBaseUnit.value, fCurrentUnit.value)
            : convertUnit(i[0], baseUnit.value, currentUnit.value),
          i[1]
        ];
      });
    }
  }

  if (type === 'intensity') {
    if (
      (source.resultType &&
            (source.resultType === 'emeSMATRIX' ||
                source.resultType === 'FDTDSMatrixIntensity')) ||
        source.resultType === 'emeParamsSWEEP_Image'
    ) {
      config.option.dataset.xAxis.name = '';
      config.option.dataset.yAxis.name = '';
      return config;
    }
    const x = source.option.dataset.xAxis.data;
    const xName = capitalize(source.option.dataset.xAxis.name, true);
    const xUnit = source.option.dataset.xAxis.unit;

    const y = source.option.dataset.yAxis.data;

    const yName = capitalize(source.option.dataset.yAxis.name, true);
    const yUnit = source.option.dataset.yAxis.unit;

    db.baseUnitDB.intensity.x = x;
    db.baseUnitDB.intensity.y = y;
    const { customRange } = source.option.dataset;
    const { xMin, xMax, yMin, yMax } = customRange ?? {};
    db.viewData.image.pureX =
        xMin === undefined || xMax === undefined
          ? x
          : x.filter((x, index) => x >= xMin).filter((x, index) => x <= xMax);

    db.viewData.image.pureY =
        yMin === undefined || yMax === undefined
          ? y
          : y.filter((y, index) => y >= yMin).filter((y, index) => y <= yMax);

    config.option.dataset.xAxis.data = x.map((i) => {
      return xUnit && (xUnit === 'THz' || xUnit === 'MHz')
        ? fConvertUnit(i, fBaseUnit.value, fCurrentUnit.value)
        : xUnit && (xUnit === 'ms' || xUnit === 'fs')
          ? convertUnit(i, TBaseUnit.value, TCurrentUnit.value)
          : convertUnit(i, baseUnit.value, currentUnit.value);
    });

    config.option.dataset.yAxis.data = y.map((i) => {
      return yUnit && (yUnit === 'THz' || yUnit === 'MHz')
        ? fConvertUnit(i, fBaseUnit.value, fCurrentUnit.value)
        : yUnit && (yUnit === 'ms' || yUnit === 'fs')
          ? convertUnit(i, TBaseUnit.value, TCurrentUnit.value)
          : convertUnit(i, baseUnit.value, currentUnit.value);
    });

    if (xName === undefined) {
      config.option.dataset.xAxis.name = '';
      db.viewData.image.unitX = '';
    } else {
      config.option.dataset.xAxis.name = isSpecialUnit(xName)
        ? `${xName}`
        : xUnit && (xUnit === 'THz' || xUnit === 'MHz')
          ? `${xName} (${fCurrentUnit.value})`
          : xUnit && (xUnit === 'ms' || xUnit === 'fs')
            ? `${xName} (${TCurrentUnit.value})`
            : `${xName} (${currentUnit.value})`;

      db.viewData.image.unitX = isSpecialUnit(xName)
        ? ''
        : xUnit && (xUnit === 'THz' || xUnit === 'MHz')
          ? `${fCurrentUnit.value}`
          : xUnit && (xUnit === 'ms' || xUnit === 'fs')
            ? `${TCurrentUnit.value}`
            : `${currentUnit.value}`;
    }

    if (yName === undefined) {
      config.option.dataset.yAxis.name = '';
      db.viewData.image.unitY = '';
    } else {
      config.option.dataset.yAxis.name = isSpecialUnit(yName)
        ? `${yName}`
        : yUnit && (yUnit === 'THz' || yUnit === 'MHz')
          ? `${yName} (${fCurrentUnit.value})`
          : yUnit && (yUnit === 'ms' || yUnit === 'fs')
            ? `${yName} (${TCurrentUnit.value})`
            : `${yName} (${currentUnit.value})`;

      db.viewData.image.unitY = isSpecialUnit(yName)
        ? ''
        : yUnit && (yUnit === 'THz' || yUnit === 'MHz')
          ? `${fCurrentUnit.value}`
          : yUnit && (yUnit === 'ms' || yUnit === 'fs')
            ? `${TCurrentUnit.value}`
            : `${currentUnit.value}`;
    }
  }

  return config;
};

import * as echarts from 'echarts';
import { minMax } from '../../ui';
import { toMaxSN } from '../intensityCanvas/help';
import { db } from '../../dataBase';
import { genAxisLabels, calcXAxisNum, calcYAxisNum } from '../../utils';
import {
  getDefaultOptionConfig,
  getLegendConfig,
  getXAxisConfig,
  getYAxisConfig,
  getToolTipConfig,
  getToolBoxConfig,
  getGraphicConfig,
  getDataZommConfig
} from './getConfig';
import { getXName, getYName } from './getName';

export const multiLineByEChart = (para: any) => {
  db.echartInstance = echarts.init(para.dom);
  const WIDTH = para.dom.getBoundingClientRect().width;
  const HEIGHT = para.dom.getBoundingClientRect().height;

  const { dataset: { yAxis, xAxis, lineInfo, legend, seq, customRange, scatter, smooth }} = para.option;

  const { xMin, xMax } = customRange ?? {};

  const SEQ = seq !== undefined;
  const leg = legend ?? [];
  const titles = leg?.data ?? [];

  db.lineData.xAxis = xAxis.data;
  db.lineData.yAxis = yAxis.data;
  const pureX = db.baseUnitDB.line.x;
  let xAxisPure = xAxis.pure ?? false;

  const MultiLineKeepPure = xAxis.MultiLineKeepPure ?? false;

  if (xAxis.data.length > 1 || xAxis.name === 'Mode' && xAxis.data[0].length > 10) {
    xAxisPure = false;
  }

  if (MultiLineKeepPure) {
    xAxisPure = true;
  }

  const SERIES = yAxis.data.map((i: any, index: number) => {
    return {
      name: titles.length ? titles[index] : [],
      type: 'line',
      smooth: smooth ?? true,
      data: yAxis.data[index].map((y: any, INDEX: number) => {
        if (xAxis.data.length < 2) {
          return xAxisPure ? [pureX[0][INDEX], y] : [xAxis.data[0][INDEX], y];
        } else {
          return xAxisPure ? [pureX[index][INDEX], y] : [xAxis.data[index][INDEX], y];
        }
      }).filter((arr: any, idx: number) => xMin === undefined || xMax === undefined || pureX[index][idx] >= xMin && pureX[index][idx] <= xMax),
      itemStyle: {
        color: lineInfo === undefined ? '#409EFF' : lineInfo[index]?.color ? lineInfo[index]?.color : '409EFF',
        borderWidth: lineInfo === undefined ? 2 : SEQ ? (lineInfo[index]?.seq === seq ? 2 : 0.8) : 2,
        opacity: lineInfo === undefined ? 1 : lineInfo[index]?.show === undefined ? 1 : lineInfo[index].show ? SEQ ? lineInfo[index]?.seq === seq ? 1 : 0.7 : 1 : 0
      },
      lineStyle: {
        opacity: lineInfo === undefined ? 1 : lineInfo[index]?.show === undefined ? 1 : lineInfo[index].show ? SEQ ? lineInfo[index]?.seq === seq ? 1 : 0.7 : 1 : 0,
        color: lineInfo === undefined ? '#409EFF' : lineInfo[index]?.color || null,
        width: lineInfo === undefined ? 2 : SEQ ? (lineInfo[index]?.seq === seq ? 2 : 0.8) : 2
      }
    };
  });

  if (scatter && scatter.data.length) {
    SERIES.push(scatter);
  }

  const xArr: any[] = [];
  const yArr: any[] = [];
  for (let i = 0; i < SERIES.length; i++) {
    for (let j = 0; j < SERIES[i].data.length; j++) {
      xArr.push(SERIES[i].data[j][0]);
      yArr.push(SERIES[i].data[j][1]);
    }
  }

  const XMAX = minMax(xArr)[1];
  const XMIN = minMax(xArr)[0];

  const YMAX = minMax(yArr)[1];
  const YMIN = minMax(yArr)[0];

  const testW = WIDTH > 860 ? WIDTH * 0.92 : WIDTH * 0.78;

  const isMode = !!((xAxis?.name === 'Mode' || xAxis?.name === 'mode') && xAxisPure);

  const xLABELS: Array<number> = genAxisLabels(isMode, calcXAxisNum(testW, xArr.length), xArr, XMIN, XMAX);
  const yLABELS: Array<number> = genAxisLabels(false, calcYAxisNum(HEIGHT * 0.7, yArr.length), yArr, YMIN, YMAX);

  const xMaxSN = xAxisPure ? { maxE: 0, label: xArr.map(x => x.toString()) } : toMaxSN([...new Set(xLABELS)]);

  let xLabels = [...new Set(xMaxSN.label)];
  const xMaxE = xMaxSN.maxE;

  const yMaxSN = toMaxSN([...new Set(yLABELS)]);
  let yLabels = [...new Set(yMaxSN.label)];
  const yMaxE = yMaxSN.maxE;

  if (yLabels.length < 2) {
    yLabels = Number(yLabels[0]) > 0 ? ['0', yLabels[0]] : [yLabels[0], '0'];
  }

  if (xLabels.length < 2) {
    xLabels = Number(xLabels[0]) > 0 ? ['0', xLabels[0]] : [xLabels[0], '0'];
  }

  if (yLabels.length === 2 && Number(yLabels[0]) === 0 && Number(yLabels[1]) === 0) {
    yLabels = ['0', '1'];
  }

  if (xLabels.length === 2 && Number(xLabels[0]) === 0 && Number(xLabels[1]) === 0) {
    xLabels = ['0', '1'];
  }

  const xSeg = xLabels.length - 1;
  const ySeg = yLabels.length - 1;

  let xInterval = 0;
  let yInterval = 0;
  if (XMAX === XMIN && xLabels.length === 2) {
    xInterval = Math.abs(XMAX);
    yInterval = YMAX - YMIN === 0 ? Math.abs(YMAX) : Math.abs((YMAX - YMIN) / ySeg);
  } else if (YMAX === YMIN && yLabels.length === 2) {
    yInterval = Math.abs(YMAX);
    xInterval = XMAX - XMIN === 0 ? 1 : Math.abs((XMAX - XMIN) / xSeg);
  } else if (XMAX === XMIN && xLabels.length === 2 && YMAX === YMIN && yLabels.length === 2) {
    yInterval = Math.abs(YMAX);
    xInterval = Math.abs(XMAX);
  } else {
    xInterval = XMAX - XMIN === 0 ? Math.abs(XMAX) : Math.abs((XMAX - XMIN) / xSeg);
    yInterval = YMAX - YMIN === 0 ? Math.abs(YMAX) : Math.abs((YMAX - YMIN) / ySeg);
  }

  if (XMAX === 0 && xLabels.length === 2 || xInterval < 1 && xLabels.length === 2) {
    xInterval = 1;
  }

  if (YMAX === 0 && yLabels.length === 2 || yInterval < 1 && yLabels.length === 2) {
    yInterval = 1;
  }

  const defaultConfig = getDefaultOptionConfig(WIDTH, HEIGHT);
  const option = {
    grid: defaultConfig.grid,
    legend: getLegendConfig(titles, defaultConfig.legend.show, WIDTH, HEIGHT),
    toolbox: getToolBoxConfig(),
    tooltip: getToolTipConfig(),
    xAxis: getXAxisConfig(getXName(xAxis, xMaxE), xInterval, xSeg, xLabels, xAxisPure, pureX),
    yAxis: getYAxisConfig(getYName(yAxis, yMaxE), yInterval, ySeg, yLabels),
    graphic: getGraphicConfig(),
    dataZoom: getDataZommConfig(),
    scaleLimit: {
      min: XMIN,
      max: XMAX
    },
    series: SERIES
  };
  option && db.echartInstance.clear();
  option && db.echartInstance.setOption(option, {
    replaceMerge: ['xAxis', 'yAxis', 'series'],
    notMerge: false,
    lazyUpdate: true
  });
};

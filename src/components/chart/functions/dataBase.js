export const db = {
  baseUnitDB: {
    line: { x: [] },
    intensity: {
      x: [],
      xAxisPure: false,
      rangeX: {
        min: null,
        max: null
      },
      rangeY: {
        min: null,
        max: null
      },
      y: [],
      yAxisPure: false
    }
  },
  viewData: {
    image: {
      data: [[]],
      x: [],
      y: [],
      pureX: [],
      pureY: [],
      unitX: '',
      unitY: ''
    },
    line: {
      x: [],
      y: [],
      unitX: '',
      unitY: '',
      xName: ''
    }
  },
  lineData: {
    xAxis: [],
    yAxis: []
  },
  intensityMinMax: {
    min: null,
    max: null
  },
  imageDataMinMax: {
    min: null,
    max: null
  },
  lineDataMinMax: {
    min: null,
    max: null
  },
  smatrix: {
    line: []
  },
  fdtdSMatrixIntensity: [],
  eme: {
    attrs: {
      parameter: 0
    }
  },
  echartInstance: {},
  vChartDom: {},
  chartIsEmpty: false,
  rAFID: 0,
  startRAF: false,
  pTime: 0,
  langName: ''
};

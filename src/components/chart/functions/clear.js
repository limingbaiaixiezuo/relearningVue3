import { db } from './dataBase';

export const clearAllVisualizerLocalStorageData = () => {
  db.baseUnitDB.line.x = [];
  db.baseUnitDB.intensity.x = [];
  db.baseUnitDB.intensity.xAxisPure = false;
  db.baseUnitDB.intensity.rangeX.min = null;
  db.baseUnitDB.intensity.rangeX.max = null;
  db.baseUnitDB.intensity.rangeY.min = null;
  db.baseUnitDB.intensity.rangeY.max = null;
  db.baseUnitDB.intensity.y = [];
  db.baseUnitDB.intensity.yAxisPure = false;
  db.viewData.image.data = [[]];
  db.viewData.image.x = [];
  db.viewData.image.y = [];
  db.viewData.image.pureX = [];
  db.viewData.image.pureY = [];
  db.viewData.image.unitX = '';
  db.viewData.image.unitY = '';
  db.viewData.line.x = [];
  db.viewData.line.y = [];
  db.viewData.line.unitX = '';
  db.viewData.line.unitY = '';
  db.viewData.line.xName = '';
  db.lineData.xAxis = [];
  db.lineData.yAxis = [];
  db.intensityMinMax.min = null;
  db.intensityMinMax.max = null;
  db.imageDataMinMax.min = null;
  db.imageDataMinMax.max = null;
  db.lineDataMinMax.min = null;
  db.lineDataMinMax.max = null;
  db.smatrix.line = null;
  db.fdtdSMatrixIntensity = [];
  db.eme.attrs.parameter = 0;
  db.echartInstance = {};
  db.vChartDom = {};
  if (db.rAFID) {
    cancelAnimationFrame(db.rAFID);
  }
  db.rAFID = 0;
  db.startRAF = false;
  db.pTime = 0;
};

export const clearEChartInstance = () => {
  if (
    db.echartInstance['dispose'] !== undefined && !db.echartInstance.isDisposed()
  ) {
    db.echartInstance.dispose();
  }
};

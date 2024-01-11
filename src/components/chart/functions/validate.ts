import { db } from './dataBase';
export const chartDataCheck = (dom: HTMLDivElement | undefined, props:any, showEmpty: any) => {
  if (dom === null || dom === undefined) return false;
  if (!props?.config?.option) {
    return false;
  }
  if (
    props?.config?.type === 'multiLine' &&
        !props?.config?.option?.dataset?.yAxis?.data
  ) {
    return false;
  }
  if (
    props?.config?.type === 'intensity' &&
        !props?.config?.option?.dataset?.data
  ) {
    return false;
  }

  if (props.config.type === 'intensity') {
    const { data, dx, dy, xAxis, yAxis } = props.config.option.dataset;
    if (
      data.length < 1 ||
            data[0].length < 1 ||
            dx.length < 1 ||
            dy.length < 1 ||
            xAxis.data.length < 1 ||
            yAxis.data.length < 1 ||
            data[0][0] === null ||
            isNaN(data[0][0])
    ) {
      showEmpty(dom);
      return false;
    }
  }

  if (props.config.type === 'multiLine') {
    if (db.rAFID) {
      cancelAnimationFrame(db.rAFID);
    }
    const { xAxis, yAxis } = props.config.option.dataset;

    if (xAxis.data[0].length < 1 || yAxis.data[0].length < 1) {
      showEmpty(dom);
      return false;
    }

    if (xAxis.data.length === 1 && (xAxis.data[0][0] === null || isNaN(xAxis.data[0][0])) || yAxis.data.length === 1 && (yAxis.data[0][0] === null || isNaN(yAxis.data[0][0]))) {
      showEmpty(dom);
      return false;
    }
  }

  return true;
};

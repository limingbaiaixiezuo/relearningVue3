
export const chartDataEmptyCheck = (config) => {
  if (config.option?.dataset === undefined) return true;
  if (config.type === 'intensity') {
    const { data, dx, dy, xAxis, yAxis } = config.option.dataset;
    if (
      data.length < 1 ||
            data[0].length < 1 ||
            dx.length < 1 ||
            dy.length < 1 ||
            xAxis.data.length < 1 ||
            yAxis.data.length < 1
    ) {
      return true;
    }
  }

  if (config.type === 'multiLine') {
    const { xAxis, yAxis } = config.option.dataset;

    if (xAxis.data[0].length < 1 || yAxis.data[0].length < 1) {
      return true;
    }

    if (xAxis.data.length === 1 && (xAxis.data[0][0] === null || isNaN(xAxis.data[0][0])) || yAxis.data.length === 1 && (yAxis.data[0][0] === null || isNaN(yAxis.data[0][0]))) {
      return true;
    }
  }
  return false;
};

import { toSN } from '../lib';

export const getDefaultOptionConfig = (WIDTH: number, HEIGHT: number) => {
  return {
    grid: {
      width: WIDTH > 860 ? '92%' : '78%',
      left: WIDTH > 860 ? '5%' : '12%',
      height: HEIGHT > 550 ? '80%' : '70%',
      top: HEIGHT > 550 ? '7%' : '14%',
      show: true,
      containLabel: true
    },
    legend: {
      show: true
    }
  };
};

export const getLegendConfig = (titles: Array<string>, show: boolean, WIDTH: number, HEIGHT: number) => {
  const visible = !titles ? false : show;
  const H = HEIGHT * 0.07;
  const W = WIDTH > 860 ? WIDTH * 0.92 : WIDTH * 0.78;

  return {
    type: 'scroll',
    data: titles,
    show: visible,
    width: W,
    hegiht: H
  };
};

export const getXAxisConfig = (xNAME: string, xInterval: number, xSeg: number, xLabels: Array<string> | string, xAxisPure: boolean, pureX: Array<number>) => {
  return {
    type: 'value',
    show: true,
    name: xNAME,
    nameLocation: 'center',
    nameTextStyle: {
      padding: [15, 5, 5, 5],
      fontWeight: 'bold'
    },
    interval: Math.abs(xInterval),
    splitNumber: xSeg,
    axisLabel: {
      formatter: function(value: number, index: number) {
        return xLabels[index];
      }
    },
    axisLine: {
      onZero: false
    },
    splitLine: {
      show: false
    },
    min: function(value: { min: number; }) { return value.min; },
    max: function(value: { max: number; }) { return value.max; }
  };
};

export const getYAxisConfig = (yNAME: string, yInterval: number, ySeg: number, yLabels: Array<string> | string) => {
  return {
    type: 'value',
    name: yNAME,
    nameLocation: 'center',
    nameTextStyle: {
      padding: [15, 5, 40, 5],
      fontWeight: 'bold'
    },
    show: true,
    interval: Math.abs(yInterval),
    splitNumber: ySeg,
    axisLabel: {
      formatter: function(value: number, index: number) {
        return yLabels[index];
      }
    },
    axisLine: {
      onZero: false
    },
    splitLine: {
      show: false
    },
    min: function(value: { min: number; }) { return value.min; },
    max: function(value: { max: number; }) { return value.max; }
  };
};

export const getToolTipConfig = () => {
  return {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        precision: 6
      }
    },
    formatter: (params: string | any[], value: any) => {
      let res = `<div style='text-align:left'></div>`;
      function getHtml(param: { color: any; seriesName: any; data: any[]; }) {
        const str =
                    `<div style="float: left"><span style="background: ${param.color}; width: 11px; height: 11px; border-radius: 11px;float: left; margin: 5px 3px;"></span>
                      ${param.seriesName}: ${param.data ? toSN(param.data[1], 2) : ''} &emsp;&emsp;</div>`;
        return str;
      }

      res += '<div style="clear: both">';
      for (let i = 0; i < params.length; i++) {
        res += getHtml(params[i]);
        if (params.length > 8 && i % 2 === 1) {
          res += '</div><div style="clear: both">';
        }
        if (params.length <= 8) {
          res += '</div><div style="clear: both">';
        }
      }
      res += '</div>';
      return res;
    }
  };
};

export const getToolBoxConfig = () => {
  return {
    // feature: {
    //     dataView: { show: true, readOnly: false },
    //     magicType: { show: true, type: ['line', 'scatter'] },
    //     restore: { show: true },
    //     // saveAsImage: {show: true}
    // }
  };
};

export const getGraphicConfig = () => {
  return [
    // {
    //     type: 'group',
    //     rotation: Math.PI / 4,
    //     bounding: 'raw',
    //     left: 110,
    //     top: 110,
    //     z: 1000,
    //     children: [
    //         {
    //             type: 'rect',
    //             left: 'center',
    //             top: 'center',
    //             z: 1000,
    //             shape: {
    //                 width: 400,
    //                 height: 50
    //             },
    //             style: {
    //                 fill: 'rgba(0,0,0,0.3)'
    //             }
    //         },
    //         {
    //             type: 'text',
    //             left: 'center',
    //             top: 'center',
    //             z: 1000,
    //             style: {
    //                 fill: '#fff',
    //                 text: 'ECHARTS LINE CHART',
    //                 font: 'bold 26px sans-serif'
    //             }
    //         }
    //     ]
    // },
    // {
    //     type: 'group',
    //     right: '12%',
    //     top: '12%',
    //     children: [
    //         {
    //             type: 'rect',
    //             z: 1,
    //             left: 'center',
    //             top: 'middle',
    //             shape: {
    //                 width: 150,
    //                 height: 50
    //             },
    //             style: {
    //                 fill: '#ffffff',
    //                 stroke: '#c0c4cc',
    //                 lineWidth: 1,
    //                 shadowBlur: 5,
    //                 shadowOffsetX: 2,
    //                 shadowOffsetY: 2,
    //                 shadowColor: 'rgba(0,0,0,0.2)'
    //             }
    //         },
    //         {
    //             type: 'text',
    //             z: 1,
    //             left: 'center',
    //             top: 'middle',
    //             style: {
    //                 fill: '#333',
    //                 width: 150,
    //                 overflow: 'break',
    //                 text: 'TTTTTTTTTTTTTTTTTT',
    //                 // font: '14px Microsoft YaHei'
    //             }
    //         }
    //     ]
    // }
  ];
};

export const getDataZommConfig = () => {
  return [
    {
      show: true,
      type: 'inside',
      filterMode: 'none',
      xAxisIndex: [0],
      start: 0,
      end: 100
    },
    {
      show: true,
      type: 'inside',
      filterMode: 'none',
      yAxisIndex: [0],
      start: 0,
      end: 100
    }
  ];
};

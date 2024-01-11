export const colorData = () => {
  const commonColor = {
    aqua: '#00ffff',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    black: '#000000',
    blue: '#0000ff',
    brown: '#a52a2a',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgrey: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkviolet: '#9400d3',
    fuchsia: '#ff00ff',
    gold: '#ffd700',
    green: '#008000',
    indigo: '#4b0082',
    khaki: '#f0e68c',
    lightblue: '#add8e6',
    lightcyan: '#e0ffff',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    magenta: '#ff00ff',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    orange: '#ffa500',
    pink: '#ffc0cb',
    purple: '#800080',
    violet: '#800080',
    red: '#ff0000',
    silver: '#c0c0c0',
    // white: "#ffffff",
    yellow: '#ffff00'
  };

  const humanlikeColor = [
    '#000000',
    '#FFFF00',
    '#B0E0E6',
    '#292421',
    '#E3CF57',
    '#4169E1',
    '#C0C0C0',
    '#FF9912',
    '#6A5ACD',
    '#808A87',
    '#EB8E55',
    '#87CEEB',
    '#708069',
    '#FFE384',
    '#808069',
    '#FFD700',
    '#00FFFF',
    '#DAA569',
    '#385E0F',
    // "#FFFFFF",
    '#E3A869',
    '#082E54',
    '#FAEBD7',
    '#FF6100',
    '#7FFFD4',
    '#F0FFFF',
    '#FF6103',
    '#40E0D0',
    '#F5F5F5',
    '#ED9121',
    '#00FF00',
    '#FFFFCD',
    '#FF8000',
    '#7FFF00',
    '#FFF8DC',
    '#F5DEB3',
    '#3D9140',
    '#FCE6C9',
    '#FFFAF0',
    '#802A2A',
    '#228B22',
    '#DCDCDC',
    '#A39480',
    '#7CFC00',
    // "#F8F8FF",
    '#8A360F',
    '#32CD32',
    '#F0FFF0',
    '#873324',
    '#BDFCC9',
    '#FAFFF0',
    '#D2691E',
    '#6B8E23',
    '#FAF0E6',
    '#FF7D40',
    '#308014',
    '#FFDEAD',
    '#F0E68C',
    '#2E8B57',
    '#FDF5E6',
    '#BC8F8F',
    '#00FF7F',
    '#FFF5EE',
    '#C76114',
    '#FFFAFA',
    '#734A12',
    '#A020F0',
    '#5E2612',
    '#8A2BE2',
    '#FF0000',
    '#A0522D',
    '#A066D3',
    '#9C661F',
    '#8B4513',
    '#9933FA',
    '#E3170D',
    '#F4A460',
    '#DA70D6',
    '#FF7F50',
    '#D2B48C',
    '#DDA0DD',
    '#B22222',
    '#B0171F',
    '#0000FF',
    '#B03060',
    '#3D59AB',
    '#FFC0CB',
    '#1E90FF',
    '#0B1746',
    '#FA8072',
    '#03A89E',
    '#FF6347',
    '#191970',
    '#FF4500',
    '#33A1C9',
    '#FF00FF',
    '#00C78C'
  ];

  const preShowColor = [
    '#00008B',
    '#DC143C',
    '#40E0D0',
    '#8A2BE2',
    '#000000',
    '#5F9EA0',
    '#FF1493',
    '#FFD700',
    '#DAA520',
    '#CD5C5C', // IndianRed
    '#008000', // Green
    '#4B0082', // Indigo
    '#FFB6C1', // LightPink
    '#20B2AA',
    '#008080',
    '#FA8072',
    '#FF6347',
    '#FFFF00',
    '#9ACD32'
  ];

  return {
    preShowColor,
    commonColor,
    humanlikeColor,
    colorBar: colorBar(true)
  };
};

const colorBar = (full = false) => {
  const c0 = [];
  const c1 = [];
  const c2 = [];
  const c3 = [];
  for (let i = 0; i < 256; i++) {
    c0.push([0, 0, i]);// 黑色
    c1.push([0, i, 255]);
    c2.push([i, 255, 255 - i]);
    c3.push([255, 255 - i, 0]); // 红色
  }
  return full ? [...c0, ...c1, ...c2, ...c3] : [...c1, ...c2, ...c3];
};

export const getPortInfo = {
  num: 0,
  sweepInfo: []
};

export const chartConfig = {
  pub: {
    startX: 10,
    startY: 10,
    scaleType: 'cover' // cover --> 按显示区域比例绘制； contain ---> 按照物理结构等比绘制；
  },
  titles: {
    fontSize: 12,
    position: 'center'
  },
  yAxis: {
    seg: 5, // 分成几段
    color: 'green',
    lineWidth: 1,
    markerLineWidth: 1,
    precision: 3, // 小数点后三位数
    name: {
      position: 'center',
      fontSize: 11,
      padding: 5
    },
    positon: 'left',
    sn: { // 科学计数法
      positon: [],
      direction: 'horizontal'
    }
  },
  xAxis: {
    seg: 5,
    color: 'red',
    lineWidth: 1,
    markerLineWidth: 1,
    precision: 3, // 小数点后三位数
    name: {
      position: 'center',
      fontSize: 11,
      padding: 5
    },
    positon: 'bottom',
    sn: {
      positon: [],
      direction: 'horizontal'
    }
  },
  colorBar: {
    position: {},
    size: {},
    color: {},
    fontSize: 12,
    colorData: colorBar()
  },
  cad: {
    pos: {},
    size: {}
  },
  children: [{// 分层；子层

  }],
  unit: {

  }
};

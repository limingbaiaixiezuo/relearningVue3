import { intensityByCanvas } from './intensityCanvas';
import { multiLineByEChart } from './multiLineByEChart';
// import VChart from '../../interfaces/vchart';

const F = {
  multiLine: multiLineByEChart,
  intensity: intensityByCanvas
};

export default (para: VChart): void => {
  F[para.type](para);
};

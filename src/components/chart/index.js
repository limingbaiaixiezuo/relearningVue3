// import AnChart from './AnChart.vue';
// import NonUniformGridHeatmap from './chart.tsx';
// export {
//   NonUniformGridHeatmap
// };
import { withInstall } from '@/utils';
import _NonUniformGridHeatmap from './heatmap.tsx';
import './index.less';

export const MBNonUniformGridHeatmap = withInstall(_NonUniformGridHeatmap);

export default MBNonUniformGridHeatmap;

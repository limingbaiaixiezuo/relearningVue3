// import AnChart from './AnChart.vue';
// import NonUniformGridHeatmap from './chart.tsx';
// export {
//   NonUniformGridHeatmap
// };
import { withInstall } from '@/utils';
import _Heatmap from './heatmap.tsx';
import './index.less';

export const Heatmap = withInstall(_Heatmap);
import './index.less';
export default Heatmap;

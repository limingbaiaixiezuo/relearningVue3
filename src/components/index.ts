import { withInstallAll } from '@/utils';
import * as Components from './components';
export * from './components';
export default withInstallAll(Components) as any;
// export default withInstallAll(Components) as typeof Components & {
//     // 在这里定义组件的类型
//     // 例如：
//     MBNonUniformGridHeatmap: typeof Components.MBNonUniformGridHeatmap;
//     // 其他组件类似地定义
//   };
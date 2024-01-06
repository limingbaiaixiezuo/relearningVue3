
import { withInstall } from '@/utils';
import _SortConfig from './Sort.jsx';
import _SortItem from './sort-item';
import './index.less';

export const OSortConfig = withInstall(_SortConfig);
export const OGroupItem = withInstall(_SortItem);

export default OSortConfig;

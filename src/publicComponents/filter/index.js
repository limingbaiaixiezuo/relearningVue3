
import { withInstall } from '@/utils';
import _FilterConfig from './Filter.jsx';
import _FilterConjunction from './filter-conjunction';
import './index.less';

export const OFilter = withInstall(_FilterConfig);

export const OFilterConjunction = withInstall(_FilterConjunction);

export default OFilter;

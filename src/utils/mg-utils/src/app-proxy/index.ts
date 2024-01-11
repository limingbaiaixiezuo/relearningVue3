import { CommonProxy } from './common-proxy';
import { DocProxy } from './docs-proxy';

export interface IAppProxy {
  /** 组件名称 */
  get name(): string;

  /** 获取当前用于展示的全局单位信息 */
  getCurrentUnits(): any;

  /** 获得当前所支持的单位类型信息 */
  getUnitsType(): any;

  getBaseUnitByUnit(unit: string): any;

}

export const AppProxy = ((): IAppProxy => {
  // eslint-disable-next-line no-undef
  if (!globalThis.location || Number(globalThis.location.port) === 3000) {
    return DocProxy.getInstance();
  } else {
    return CommonProxy.getInstance();
  }
})();

import { IAppProxy } from './index';
import {
  LengthUnit,
  LossUnit
} from '@/utils/mg-utils';

export class DocProxy implements IAppProxy {
  // Singleton
  private static $instance: IAppProxy = null;
  static getInstance(): IAppProxy {
    if (!this.$instance) {
      this.$instance = new DocProxy();
      // (<any>window).DocProxy = DocProxy;
    }
    return this.$instance;
  }

  /** 组件名称 */
  get name(): string {
    return 'DocProxy';
  }

  /** 获取当前用于展示的全局单位信息 */
  getCurrentUnits(): any {
    return {
      length: LengthUnit.micros,
      loss: LossUnit.dB_per_cm
    };
  }

  /** 获得当前所支持的单位类型信息 */
  getUnitsType(): any {
    return {
      length: {
        name: 'Length unit',
        units: LengthUnit
      },
      loss: {
        name: 'Loss unit',
        units: LossUnit
      }
    };
  }

  getStore() {
    return {
      state: {
        configuration: {
          currentUnits: {}
        }
      }
    };
  }

  getUnitTypeByUnit() {
    return 'length';
  }

  // 根据单位获取基准单位
  getBaseUnitByUnit(): any {
    return 'cm';
  }
}

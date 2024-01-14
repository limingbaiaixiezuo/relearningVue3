import { IAppProxy } from './index';
import { useStore } from 'vuex';

export class CommonProxy implements IAppProxy {
  // Singleton
  private static $instance: IAppProxy = null;
  store: any;

  static getInstance(): IAppProxy {
    if (!this.$instance) {
      this.$instance = new CommonProxy();
    }
    return this.$instance;
  }

  /** 组件名称 */
  get name(): string {
    return 'CommonProxy';
  }

  getStore() {
    // if (!this.store) this.store = useStore();
    // return this.store;
    return {}
  }

  /** 获取当前用于展示的全局单位信息 */
  getCurrentUnits(): any {
    // return this.getStore().state.configuration.currentUnits;
    return 'AAA'
  }

  /** 获得当前所支持的单位类型信息 */
  getUnitsType(): any {
    // return this.getStore().state.configuration.unitsType;
    return 'BBB'
  }

  getUnitTypeByUnit(currentUnit) {
    // const { unitsType } = this.getStore().state.configuration;
    // const unitType = Object.keys(unitsType).find((unitType) => {
    //   const { units } = unitsType[unitType];
    //   return Object.keys(units).find(key => units[key] === currentUnit);
    // });

    // return unitType;
    return 'CCC'
  }

  // 根据单位获取基准单位
  getBaseUnitByUnit(currentUnit: string): any {
    // const { baseUnits } = this.getStore().state.configuration;
    // const unitType = this.getUnitTypeByUnit(currentUnit);

    // return baseUnits[unitType];
    return 'DDD'
  }
}

import { computed } from 'vue';
import { convertUnit, AppProxy } from '@/utils/mg-utils';

export function useConvertUnit(props) {
  const store = AppProxy.getStore();

  const unitType = computed(() => {
    const type = AppProxy.getUnitTypeByUnit(props.unit);
    return type;
  });

  const baseUnit = computed(() => {
    const unit = AppProxy.getBaseUnitByUnit(props.unit);
    if (!unit) console.warn(`Not support unit ${props.unit} convert, maybe you want to use prop suffix`);
    return unit;
  });

  const currentUnit = computed(() => {
    // return store.state.configuration.currentUnits[unitType.value];
    return 100
  });

  return {
    unitType,
    baseUnit,
    currentUnit,
    convertUnit
  };
}

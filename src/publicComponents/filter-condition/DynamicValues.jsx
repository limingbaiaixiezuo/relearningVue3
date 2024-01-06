import {defineComponent} from 'vue';
import {createNamespace, makeObjectProp} from '@/utils';
import { useDynamicValuesComponent } from './composable';

const [name] = createNamespace('filter-dynamic-value', true);

const dynamicValuesProps = {
  modelValue: [Array, String],
  dynamicConfig: makeObjectProp({})
};

export default defineComponent({
  name,
  inheritAttrs: false,
  props: dynamicValuesProps,
  emits: ['change', 'update:modelValue'],
  setup(props, {slots, emit}) {
    const {dynamicRender} = useDynamicValuesComponent(props, emit);
    return () => {
      if (!dynamicRender.value) return null;

      return dynamicRender.value();
    };
  }
});

import { defineComponent } from 'vue';
import { makeStringProp, createNamespace } from '@/utils';

import SvgIcon from '../svg-icon/index.vue';

const [name, bem] = createNamespace('option');

const optionsProps = {
  size: makeStringProp('default'),
  type: makeStringProp('default'),
  icon: makeStringProp()
};

export default defineComponent({
  name,
  props: optionsProps,
  setup(props, {slots, attrs}) {
    const renderOptions = () => {
      return (
        <div>
          {props.icon && <SvgIcon class={bem('icon')} name={props.icon}/>}
          <span>{attrs.label}</span>
        </div>
      );
    };

    return () => {
      const realSlots = {
        default: renderOptions,
        ...slots
      };
      return (
        <ElOption
          v-slots={realSlots}
          class={[bem([props.size, props.type])]}
          {...attrs}
        >

        </ElOption>
      );
    };
  }
});

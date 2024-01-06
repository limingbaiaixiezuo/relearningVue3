import {defineComponent, nextTick, ref} from 'vue';
import {
  createNamespace,
  makeStringProp,
  makeArrayProp,
  unknownProp
} from '@/utils';
import {useI18n} from 'vue-i18n';
import FilterCondition from '../filter-condition/FilterCondition';
import {useConditionalFilling} from './useConditionalFilling.js';
import { colorArray } from '@/constant';
const [name, bem] = createNamespace('conditional-filling', true);

const filterConfigProps = {
  cols: makeArrayProp([]),
  conditions: makeArrayProp([]),
  contentClassName: makeStringProp(''),
  adapter: unknownProp
};

export default defineComponent({
  name,
  props: filterConfigProps,
  emits: ['update:conditions', 'change'],
  setup(props, {slots, emit}) {
    const {t} = useI18n();
    const contentRef = ref(null);
    const [conditions ] = useConditionalFilling(props, emit);
    const addFilterCondition = () => {
      const condition = {
        fieldId: props.cols[0].value,
        fieldType: props.cols[0].type,
        type: 'row',
        color: Math.floor(Math.random() * colorArray.length),
        operator: '',
        value: ''
      };

      emit('update:conditions', [...props.conditions, condition]);
      nextTick(() => {
        emit('change', {key: 'add', value: condition});
        if (contentRef?.value) {
          const {scrollHeight, clientHeight} = contentRef.value;
          const offsetY = scrollHeight - clientHeight;
          if (offsetY > 0) {
            contentRef.value.scrollTop += offsetY;
          }
        }
      });
    };

    const renderDefaultFooter = () => {
      return (
        <span class={bem('footer-add')} onClick={addFilterCondition}>
          <SvgIcon name='add' class={bem('footer-add-icon')} />
          {t('addCondition')}
        </span>
      );
    };

    const deleteCondition = (key) => {
      emit('update:conditions', props.conditions.filter((item, index) => index !== key));
      emit('change', {key: 'remove', value: props.conditions[key], index: key});
    };

    const renderFilterItem = (item, index) => {
      // 通过遍历失去响应式了
      return (
        <FilterCondition
          v-model:fieldId={item.fieldId}
          v-model:fieldType={item.fieldType}
          v-model:operator={item.operator}
          v-model:type={item.type}
          v-model:value={item.value}
          v-model:color={item.color}
          adapter={props.adapter}
          cols={props.cols}
          queryDependency={props.queryDependency}
          onChange={(val) => emit('change', {...val, index})}
          onClear={() => deleteCondition(index)}
        />
      );
    };

    const render = () => {
      return (
        <div class={bem()}>
          <div ref={contentRef} class={[bem('content'), props.contentClassName]}>
            {conditions.value.map((item, index) => renderFilterItem(item, index))}
          </div>
          <div class={bem('footer')}>
            {slots.footer ? slots.footer() : renderDefaultFooter()}
          </div>
        </div>
      );
    };

    return render;
  }
});

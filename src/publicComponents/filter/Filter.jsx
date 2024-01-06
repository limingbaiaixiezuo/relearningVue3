import {defineComponent, nextTick, ref} from 'vue';
import {
  createNamespace,
  makeStringProp,
  makeArrayProp,
  makeAnyProp,
  unknownProp
} from '@/utils';
import {useI18n} from 'vue-i18n';
import FilterCondition from '../filter-condition/FilterCondition';
import FilterConjunction from './filter-conjunction';
import {useFilterConfig} from './useFilterConfig';
const [name, bem] = createNamespace('filter-config', true);
const isAbsent = Symbol();
const filterConfigProps = {
  cols: makeArrayProp([]),
  conditions: makeArrayProp([]),
  conjunction: makeAnyProp(isAbsent),
  contentClassName: makeStringProp(''),
  adapter: unknownProp
};

export default defineComponent({
  name,
  props: filterConfigProps,
  emits: ['update:conditions', 'update:conjunction', 'change'],
  setup(props, {slots, emit}) {
    const {t} = useI18n();
    const contentRef = ref(null);
    const [conditions, conjunction] = useFilterConfig(props, emit);

    const addFilterCondition = () => {
      const newVal = {
        fieldId: props.cols[0].id,
        fieldType: props.cols[0].type,
        operator: '',
        value: ''
      };

      emit('update:conditions', [...props.conditions, newVal]);

      nextTick(() => {
        emit('change', {key: 'add', value: newVal});
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
          <SvgIcon name='add-circle' class={bem('footer-add-icon')} />
          {t('addCondition')}
        </span>
      );
    };

    const deleteCondition = (key) => {
      const val = props.conditions.filter((item, index) => index !== key);
      emit('update:conditions', val);
      nextTick(() => {
        emit('change', {key: 'remove', value: props.conditions[key], index: key});
      });
    };

    const renderFilterItem = (item, index) => {
      // 通过遍历失去响应式了
      return (
        <FilterCondition
          cols={props.cols}
          v-model:fieldId={item.fieldId}
          v-model:fieldType={item.fieldType}
          v-model:operator={item.operator}
          v-model:value={item.value}
          adapter={props.adapter}
          onChange = {(val) => emit('change', {...val, index})}
          onClear={() => deleteCondition(index)}
        />
      );
    };

    const renderConjunction = () => {
      return (
        <div class={bem('conjunction')}>
          <FilterConjunction
            v-model={conjunction.value}
          />
        </div>
      );
    };

    const render = () => {
      return (
        <div class={bem()}>
          {props.conjunction !== isAbsent && renderConjunction()}
          <div ref={contentRef} class={[bem('content'), props.contentClassName]} key={conditions.value.length}>
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

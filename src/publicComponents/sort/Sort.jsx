import { defineComponent, ref, computed, nextTick } from 'vue';
import {
  createNamespace,
  // makeObjectProp,
  makeStringProp,
  makeArrayProp
} from '@/utils';
import {useI18n} from 'vue-i18n';
import SortItem from './sort-item';
import {useSortConfig, sortEmits} from './useSortConfig';
import { ElSelectV2 } from 'element-plus';
const [name, bem] = createNamespace('sort-config', true);

const sortProps = {
  conditions: makeArrayProp([]),
  cols: makeArrayProp([]),
  contentClassName: makeStringProp()
};

export default defineComponent({
  name,
  props: sortProps,
  emits: sortEmits,
  setup(props, {emit, slots}) {
    const {t} = useI18n();
    const addField = ref(null);
    const [conditions] = useSortConfig(props, emit);

    const conditionsFieldIds = computed(() => {
      return conditions.value.map(item => item.fieldId);
    });

    const addCols = computed(() => {
      return props.cols.filter(item => {
        return !conditionsFieldIds.value.includes(item.key);
      });
    });

    const addConditions = (val) => {
      const condition = {
        fieldId: val,
        sort: 'asc'
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

    const renderSelectItem = ({item}) => {
      return (
        <span v-tooltip={item.label}>
          {item?.icon ? <SvgIcon name={item.icon} style='margin-right:6PX' /> : ''}
          {item.label}
        </span>
      );
    };
    const selectSlots = {
      default: renderSelectItem
    };

    const contentRef = ref(null);

    const deleteCondition = (key) => {
      emit('update:conditions', props.conditions.filter((item, index) => index !== key));
      emit('change', {key: 'remove', value: props.conditions[key]});
    };

    const renderFilterItem = (condition, index) => {
      return (
        <SortItem
          v-model:fieldId ={condition.fieldId}
          v-model:sort ={condition.sort}
          cols={props.cols}
          colDisabledKeys={ conditionsFieldIds.value.filter((id) => condition.fieldId !== id)}
          key={index}
          onChange={(val) => emit('change', {...val, index})}
          onClear={() => deleteCondition(index)}
        />
      );
    };

    const renderDefaultFooter = () => {
      return (
        <div class={bem('footer-add')}>
          <ElSelectV2
            modelValue={addField.value}
            options={addCols.value}
            v-slots={selectSlots}
            filterable
            onChange={addConditions}
            teleported={false}
            placeholder={t('selectField')}
          />
        </div>
      );
    };

    const render = () => {
      return (
        <div class={{
          [bem()]: true,
          [bem('hide-footer')]: props.conditions.length >= props.cols.length
        }} >
          <div ref={contentRef} class={[bem('content'), props.contentClassName]}>
            {conditions.value.map((item, index) => renderFilterItem(item, index))}
          </div>
          <div class={bem('footer')} v-show={props.conditions.length < props.cols.length}>
            {
              renderDefaultFooter()
            }
          </div>
        </div>
      );
    };

    return render;
  }
});

import {defineComponent, computed} from 'vue';
import {createNamespace, makeArrayProp, makeStringProp} from '@/utils';
import {useI18n} from 'vue-i18n';
import {SORT_MODE} from '@/adapter/toolbar/constant/sort';

import { ElSelectV2 } from 'element-plus';

const [name, bem] = createNamespace('sort-item', true);

const sortItemProps = {
  fieldId: makeStringProp(),
  sort: makeStringProp(),
  cols: makeArrayProp(),
  colDisabledKeys: makeArrayProp()
};

export default defineComponent({
  name,
  props: sortItemProps,
  emits: ['update:fieldId', 'update:operator', 'update:sort', 'clear', 'change'],
  setup(props, {emit}) {
    const {t} = useI18n();
    const fields = computed(() => props.cols.filter(item => !props.colDisabledKeys.includes(item.value)));

    const renderSelectItem = ({item}) => {
      return (
        <span v-tooltip={item.label}>
          {item?.icon ? <SvgIcon name={item.icon} style='margin-right:6PX' /> : ''}
          {item.label}
        </span>
      );
    };

    const updateFieldId = (val) => {
      emit('update:fieldId', val);
      emit('change', {key: 'fieldId', value: val});
    };

    const updateSort = (val) => {
      emit('update:sort', val);
      emit('change', {key: 'sort', value: val});
    };

    const selectSlots = {
      default: renderSelectItem
    };

    const renderClearButton = () => {
      return (
        <div class={bem('clear')}>
          <span class={bem('clear-btn')} onClick={() => emit('clear', props.itemKey)}>
            <SvgIcon name='delete' />
          </span>
        </div>
      );
    };

    const renderFieldSelect = () => {
      return (
        <div class={[bem('option'), bem('field')]}>
          <ElSelectV2
            filterable
            modelValue={props.fieldId}
            onUpdate:modelValue={updateFieldId}
            options={fields.value}
            v-slots={selectSlots}
            teleported={false}
            placeholder={t('selectField')}
          />
        </div>
      );
    };

    const renderSort = () => {
      return (
        <div class={[bem('option'), bem('sort')]}>
          <div class={[bem('sort-shade'), props.sort === SORT_MODE.DESC && bem('sort-shade-right')]} />
          <div
            class={[bem('sort-asc'), props.sort === SORT_MODE.ASC && bem('sort-selected')]}
            onclick={() => updateSort(SORT_MODE.ASC)}
          >
              A-Z
          </div>
          <div
            class={[bem('sort-desc'), props.sort === SORT_MODE.DESC && bem('sort-selected')]}
            onclick={() => updateSort(SORT_MODE.DESC)}
          >
              Z-A
          </div>
        </div>
      );
    };

    const render = () => {
      return (
        <div class={bem()}>
          {renderFieldSelect()}
          {renderSort()}
          {renderClearButton()}
        </div>
      );
    };
    return render;
  }
});

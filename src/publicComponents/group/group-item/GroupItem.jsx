import {defineComponent, ref, computed, onMounted} from 'vue';
import {createNamespace, makeArrayProp, makeStringProp} from '@/utils';
import {useI18n} from 'vue-i18n';
import { Group } from '@/adapter/toolbar/group';
import {SORT_MODE} from '@/adapter/toolbar/constant/sort';

import { ElSelectV2 } from 'element-plus';

const [name, bem] = createNamespace('group-item', true);

const groupItemProps = {
  fieldId: makeStringProp(),
  operator: makeStringProp(),
  sort: makeStringProp(),
  cols: makeArrayProp(),
  colDisabledKeys: makeArrayProp()
};

export default defineComponent({
  name,
  props: groupItemProps,
  emits: ['update:fieldId', 'update:operator', 'update:sort', 'clear', 'change'],
  setup(props, {emit}) {
    const {t} = useI18n();
    const fields = computed(() => props.cols.filter(item => !props.colDisabledKeys.includes(item.value)));

    const getOperatorOptions = (val) => {
      const field = fields.value.find(col => col.value === val);
      if (field) {
        return Group.getOperatorOptions(field?.adapter, val);
      } else {
        return [];
      }
    };
    const operatorOptions = ref(getOperatorOptions(props.fieldId));

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
      operatorOptions.value = getOperatorOptions(val);
      const newOperator = operatorOptions.value?.[0]?.value || null;
      updateOperator(newOperator, false);
      emit('change', {key: 'fieldId', value: val});
    };

    const updateOperator = (val, isChange = true) => {
      emit('update:operator', val);
      if (isChange) {
        emit('change', {key: 'operator', value: val});
      }
    };
    const updateSort = (val, isChange = true) => {
      emit('update:sort', val);
      if (isChange) {
        emit('change', {key: 'sort', value: val});
      }
    };

    const init = () => {
      const operatorOption = operatorOptions.value?.[0];
      if (!props.operator && operatorOption?.value) {
        updateOperator(operatorOption?.value, false);
      }
      if (!props.sort) {
        updateSort(SORT_MODE.ASC, false);
      }
    };

    onMounted(init);

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
            teleported={false}
            v-slots={selectSlots}
            placeholder={t('selectField')}
          />
        </div>
      );
    };
    const renderOperatorSelect = () => {
      return (
        <div class={[bem('option')]}>
          <ElSelectV2
            filterable
            modelValue={props.operator}
            onUpdate:modelValue={updateOperator}
            options={operatorOptions.value}
            teleported={false}
            v-slots={selectSlots}
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
          {renderOperatorSelect()}
          {renderSort()}
          {renderClearButton()}
        </div>
      );
    };
    return render;
  }
});

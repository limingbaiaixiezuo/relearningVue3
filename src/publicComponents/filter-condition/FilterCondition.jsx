import {defineComponent, ref, shallowRef, computed, watch, onUnmounted } from 'vue';
import { Filter } from '@/adapter/toolbar/filter';
import {createNamespace, makeArrayProp, makeStringProp, makeAnyProp, makeObjectProp, debounce} from '@/utils';
import { ElSelectV2 } from 'element-plus';
import {useI18n} from 'vue-i18n';
import ColorDrop from '../tag-status-item/ColorDrop.vue';
import {colorArray} from '@/constant';

import DynamicValues from './DynamicValues';
import { FILTER_OPERATOR } from '@/adapter/toolbar/constant/filter';

const [name, bem] = createNamespace('filter-condition', true);

const isAbsent = Symbol();

const filterItemProps = {
  adapter: makeObjectProp({}),
  fieldId: makeStringProp({}),
  operator: makeStringProp({}),
  fieldType: makeStringProp(''),
  value: [Array, String],
  cols: makeArrayProp([]),
  type: makeAnyProp(isAbsent),
  color: makeAnyProp(isAbsent)
};

export default defineComponent({
  name,
  props: filterItemProps,
  emits: ['clear', 'update:fieldId', 'update:fieldType', 'update:operator', 'update:value', 'update:type', 'update:color', 'change'],
  setup(props, {slots, emit}) {
    const {t} = useI18n();
    const currentField = shallowRef();
    const operatorOptions = ref([]);
    const dynamicConfig = ref({});

    const renderSelectItem = ({item}) => {
      return (
        <span v-tooltip={item.label}>
          {item?.icon ? <SvgIcon name={item.icon} style='margin-right:6PX' /> : ''}
          {item.label}
        </span>
      );
    };

    const updateValueGetOptions = debounce(function(values) {
      const isUpdateDynamicConfig = values.some(({fieldId}) => props.fieldId === fieldId);

      if (isUpdateDynamicConfig) {
        dynamicConfig.value = Filter.getDynamicComponentOptions(props.adapter, props.fieldId, props.operator);
      }
    }, 300);

    const selectSlots = {
      default: renderSelectItem
    };

    const updateFieldId = (val) => {
      const field = props.adapter.getColumnById(val);
      emit('update:fieldId', val);
      emit('update:fieldType', field.type);
      generateOperatorOptions(val);
      emit('change', {key: 'fieldId', value: val});
    };

    const generateOperatorOptions = (val) => {
      currentField.value = props.adapter.getColumnById(val);
      // TODO adapter
      operatorOptions.value = Filter.getOperatorOptions(props.adapter, currentField.value?.id);
      updateOperator(operatorOptions.value[0].value, false);
    };

    const updateOperator = (operator, isChange = true) => {
      emit('update:operator', operator);
      if (operator === FILTER_OPERATOR.REFERENCE) {
        emit('update:value', []);
      } else {
        emit('update:value', '');
      }

      if (isChange) {
        emit('change', {key: 'operator', value: operator});
      }
      // TODO adapter
      dynamicConfig.value = Filter.getDynamicComponentOptions(props.adapter, currentField.value.id, operator);
    };

    const init = () => {
      if (props.operator) {
        currentField.value = props.adapter.getColumnById(props.fieldId);
        operatorOptions.value = Filter.getOperatorOptions(props.adapter, currentField.value?.id);
        dynamicConfig.value = Filter.getDynamicComponentOptions(props.adapter, currentField.value.id, props.operator);
      } else {
        generateOperatorOptions(props.fieldId);
      }
      props.adapter.on && props.adapter.on(props.adapter.EVENTS.setValues, updateValueGetOptions);
    };

    init();

    onUnmounted(() => {
      props.adapter?.on && props.adapter.off(props.adapter.EVENTS.setValues, updateValueGetOptions);
    });

    watch(() => props.index, () => {
      console.log('执行');
      init();
    });

    const updateType = (val) => {
      emit('update:type', val);
      emit('change', {key: 'type', value: val});
    };
    const updateColor = (val) => {
      emit('update:color', val);
      emit('change', {key: 'color', value: val});
    };

    const typeOptions = computed(() => ([
      {
        label: t('cell'),
        value: 'cell'
      },
      {
        label: t('row'),
        value: 'row'
      }
    ]));

    const colorDropStyle = {
      height: '36px',
      marginRight: '4px',
      width: '40px'
    };

    const renderColor = () => {
      return (
        <div className='div'>
          <ColorDrop
            color-array={colorArray}
            color={colorArray[props.color]}
            click-visible
            teleported={false}
            colorDropStyle={colorDropStyle}
            onSetColor={updateColor}
          />
        </div>
      );
    };

    const renderType = () => {
      return (
        <div class={[bem('select'), bem('type')]}>
          <ElSelectV2
            modelValue={props.type}
            filterable
            onUpdate:modelValue={updateType}
            teleported={false}
            v-slots={selectSlots}
            options={typeOptions.value}
          />
        </div>
      );
    };

    const renderField = () => {
      return (
        <div class={[bem('select'), bem('field')]}>
          <ElSelectV2
            modelValue={props.fieldId}
            onUpdate:modelValue={updateFieldId}
            v-slots={selectSlots}
            filterable
            options={props.cols}
            teleported={false}
            placeholder={t('selectField')}
          />
        </div>
      );
    };

    const renderOperator = () => {
      return (
        <div class={[bem('select'), bem('operator')]}>
          <ElSelectV2
            modelValue={props.operator}
            filterable
            onUpdate:modelValue={updateOperator}
            teleported={false}
            options={operatorOptions.value}
            placeholder='Select operator'
          />
        </div>
      );
    };

    const updateValue = (val) => {
      emit('update:value', val);
      emit('change', {key: 'value', value: val});
    };

    const renderValue = () => {
      const style = props.operator === FILTER_OPERATOR.REFERENCE ? '' : 'width:240PX';
      return (
        <div class={[bem('select'), bem('value')]} style={style}>
          <DynamicValues
            dynamicConfig={dynamicConfig.value}
            modelValue={props.value}
            onUpdate:modelValue={updateValue}
            placeholder='Select value'
          />
        </div>
      );
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

    const render = () => {
      return (
        <div class={bem()}>
          <div class={bem('selectTop')}>
            {props.color !== isAbsent && renderColor()}
            {props.type !== isAbsent && renderType()}
            {renderField()}
            {renderOperator()}
            {renderValue()}
          </div>
          {renderClearButton()}
        </div>
      );
    };

    return render;
  }
});

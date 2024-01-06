import { ref, watch } from 'vue';
import { ElInput, ElInputNumber, ElDatePicker, ElSelectV2 } from 'element-plus';
import { FILTER_VALUES_COMPONENTS } from '@/adapter/toolbar/constant/filter'; import i18n from '@/language/index';
const { t } = i18n.global;

export function useDynamicValuesComponent(props, emit) {
  const dynamicRender = ref(null);

  const updateModelValue = (val) => {
    emit('update:modelValue', val);
  };

  const changeHandler = (val) => {
    emit('change', val);
  };

  const updateDbSelectValue = (num, value) => {
    if (!props.modelValue) props.modelValue = [];
    props.modelValue[num] = value;
    emit('update:modelValue', props.modelValue);
  };

  const renderEmpty = () => {
    return (
      <ElInput
        disabled
      />
    );
  };

  const renderText = () => {
    return (
      <ElInput
        key={FILTER_VALUES_COMPONENTS.TEXT}
        placeholder={t('Please input')}
        modelValue={props.modelValue}
        onUpdate:modelValue={updateModelValue}
        onChange={changeHandler}
      />
    );
  };

  const renderNumber = () => {
    return (
      <ElInputNumber
        key={FILTER_VALUES_COMPONENTS.NUMBER}
        placeholder={t('Please input')}
        modelValue={props.modelValue}
        onUpdate:modelValue={updateModelValue}
        onChange={changeHandler}
      />
    );
  };

  const renderSelectItem = ({item}) => {
    return (
      <span v-tooltip={item.label}>
        {item?.icon ? <SvgIcon name={item.icon} style='margin-right:6PX' /> : ''}
        {item.label}
      </span>
    );
  };

  const renderSelect = () => {
    return (
      <ElSelectV2
        key={FILTER_VALUES_COMPONENTS.SELECT}
        placeholder={t('Please select')}
        multiple
        filterable
        collapse-tags
        maxCollapseTags={3}
        modelValue={props.modelValue}
        teleported={false}
        onUpdate:modelValue={updateModelValue}
        onChange={changeHandler}
        {...props.dynamicConfig.props}
        v-slots={renderSelectItem}
      />
    );
  };

  const renderDate = () => {
    console.log(props.modelValue);
    return (
      <ElTooltip
        effect='dark'
        content={props.modelValue ? props.modelValue : t('Please select a date')}
        placement='right'
      >
        <div>
          <ElDatePicker
            valueFormat='YYYY-MM-DD'
            key={FILTER_VALUES_COMPONENTS.DATE}
            modelValue={props.modelValue}
            teleported={false}
            onUpdate:modelValue={updateModelValue}
            onChange={changeHandler}
            {...props.dynamicConfig.props}
          />
        </div>
      </ElTooltip>
    );
  };

  const renderDoubleSelect = () => {
    return (
      <>
        <ElSelectV2
          key={FILTER_VALUES_COMPONENTS.DOUBLE_SELECT}
          placeholder={t('Please select')}
          filterable
          modelValue={props.modelValue[0]}
          teleported={false}
          onUpdate:modelValue={(value) => updateDbSelectValue(0, value)}
          onChange={changeHandler}
          options={props.dynamicConfig.props.options}
          v-slots={renderSelectItem}
        />
        <ElSelectV2
          key={FILTER_VALUES_COMPONENTS.DOUBLE_SELECT + 2}
          placeholder={t('Please select')}
          filterable
          modelValue={props.modelValue[1]}
          teleported={false}
          onUpdate:modelValue={(value) => updateDbSelectValue(1, value)}
          onChange={changeHandler}
          options={props.dynamicConfig.props.options2}
          v-slots={renderSelectItem}
          class={'signboard'}
        />
      </>
    );
  };

  const VALUES_COMPONENTS_MAP = {
    [FILTER_VALUES_COMPONENTS.EMPTY]: renderEmpty,
    [FILTER_VALUES_COMPONENTS.TEXT]: renderText,
    [FILTER_VALUES_COMPONENTS.NUMBER]: renderNumber,
    [FILTER_VALUES_COMPONENTS.SELECT]: renderSelect,
    [FILTER_VALUES_COMPONENTS.DATE]: renderDate,
    [FILTER_VALUES_COMPONENTS.DOUBLE_SELECT]: renderDoubleSelect
  };

  watch(
    () => props.dynamicConfig,
    (val) => {
      let name = FILTER_VALUES_COMPONENTS.EMPTY;
      if (props.dynamicConfig.name) name = props.dynamicConfig.name;
      dynamicRender.value = VALUES_COMPONENTS_MAP[name];
    },
    {immediate: true}
  );

  return {
    dynamicRender
  };
}

import { defineComponent, ref, computed, nextTick } from 'vue';
import {
  createNamespace,
  unknownProp,
  // makeObjectProp,
  makeStringProp,
  makeArrayProp,
  makeNumberProp
} from '@/utils';
import {useI18n} from 'vue-i18n';
import GroupItem from './group-item';
import GroupHead from './group-conjunction';
import {useGroupConfig, groupEmits} from './useGroupConfig';
import { ElSelectV2 } from 'element-plus';
const [name, bem] = createNamespace('group-config', true);

const groupProps = {
  conditions: makeArrayProp([]),
  cols: makeArrayProp([]),
  adapter: unknownProp,
  contentClassName: makeStringProp(),
  maxConditions: makeNumberProp(3)
};

export default defineComponent({
  name,
  props: groupProps,
  emits: groupEmits,
  setup(props, {emit}) {
    const {t} = useI18n();
    const addField = ref(null);
    const [conditions] = useGroupConfig(props, emit);

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
        operator: '',
        sort: ''
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
      emit('change', {key: 'remove', value: props.conditions[key], index: key});
    };

    const renderFilterItem = (condition, index) => {
      return (
        <GroupItem
          v-model:fieldId ={condition.fieldId}
          v-model:operator ={condition.operator}
          v-model:sort ={condition.sort}
          cols={props.cols}
          colDisabledKeys={ conditionsFieldIds.value.filter((id) => condition.fieldId !== id)}
          key={index}
          onChange={(val) => emit('change', {...val, index})}
          onClear={() => deleteCondition(index)}
        />
      );
    };

    const renderHead = () => {
      return (
        <div>
          <GroupHead
            adapter={props.adapter}/>
        </div>
      );
    };

    const renderDefaultFooter = () => {
      return (
        <div class={bem('footer-add')}>
          <ElSelectV2
            modelValue={addField.value}
            options={addCols.value}
            filterable
            v-slots={selectSlots}
            onChange={addConditions}
            placeholder={t('selectField')}
            teleported={false}
          />
        </div>
      );
    };

    const render = () => {
      return (
        <div class={{
          [bem()]: true,
          [bem('hide-footer')]: props.maxConditions <= conditions.value.length
        }} >
          {renderHead()}
          <div ref={contentRef} class={[bem('content'), props.contentClassName]} key={conditions.value.length}>
            {conditions.value.map((item, index) => renderFilterItem(item, index))}
          </div>
          <div class={bem('footer')} v-show={props.maxConditions > conditions.value.length}>
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

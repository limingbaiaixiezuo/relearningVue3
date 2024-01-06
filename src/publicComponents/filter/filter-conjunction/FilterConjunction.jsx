import {defineComponent} from 'vue';
import {createNamespace } from '@/utils';
import { useI18n } from 'vue-i18n';
import { ElSelect, ElOption } from 'element-plus';
const [name, bem] = createNamespace('filter-conjunction', true);

const filterConjunctionProps = {
};

export default defineComponent({
  name,
  props: filterConjunctionProps,
  setup(props, {attrs, emit}) {
    const {t} = useI18n();

    const conjunctions = [
      {
        key: 'and',
        label: 'all'
      },
      {
        key: 'or',
        label: 'any'
      }
    ];
    const renderSelectItem = (item) => {
      return (
        <ElOption
          key={item.key}
          value={item.key}
          label={t(item.label)}
        >
          {t(item.label)}
        </ElOption>

      );
    };

    const render = () => {
      return (
        <div class={bem()}>
          {t('meetingAnd')}
          <div class={bem('select-container')}>
            <ElSelect
              placement='bottom'
              teleported={false}
              valueKey='key'
              {...attrs}
            >
              {conjunctions.map(renderSelectItem)}
            </ElSelect>
          </div>
          {t('ofTheConditions')}
        </div>
      );
    };

    return render;
  }
});

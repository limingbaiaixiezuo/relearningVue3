import {defineComponent, markRaw} from 'vue';
import {createNamespace } from '@/utils';
import { useI18n } from 'vue-i18n';
import { makeObjectProp } from '@/utils';
const [name, bem] = createNamespace('group-conjunction', true);

const groupProps = {
  adapter: makeObjectProp({})
};

export default defineComponent({
  name,
  props: groupProps,
  setup(props, {attrs, emit}) {
    const {t} = useI18n();

    const adapter = markRaw(props.adapter);

    const triggerCollapse = (all) => {
      all = !all;
      adapter.foldAllGroup(all);
    };

    const render = () => {
      return (
        <div class={bem('top')}>
          <span onClick={() => triggerCollapse(false)}>{t('Collapse all')}</span>
          <span onClick={() => triggerCollapse(true)}>{t('Expand all')}</span>
        </div>
      );
    };

    return render;
  }
});

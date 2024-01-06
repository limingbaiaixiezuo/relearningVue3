
import { getPanelData, formatDate, date2Month } from './utils';
import {Month} from './month';
import { WEEKS, TODAY, MONTH_TOGGLE, TOUCH_TIP, FORMAT_MONTH } from './constants';
import { defineComponent, ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import { createNamespace, makeStringProp } from '@/utils';
import { useTouch, Direction} from '@/composable';
import { ElButton, ElTooltip } from 'element-plus';

import './index.less';
import { SvgIcon } from '@/components';

const [name, bem] = createNamespace('calendar', true);
const [, weekBem] = createNamespace('week', true);

const props = {
  lang: makeStringProp('zh'),
  defaultDate: Date,
  monthPicker: Function
};

export default defineComponent({
  name,
  props,
  setup(props, { attrs }) {
    const step = ref(0);
    const panelData = computed(() => getPanelData(step.value));
    const defaultDate2Month = props.defaultDate && dayjs(props.defaultDate).format(FORMAT_MONTH);
    const isMobile = ref(false);
    const isChangeMonth = ref(false);
    const touch = useTouch();

    onMounted(() => {
      if (defaultDate2Month) {
        const currStep = dayjs(props.defaultDate).diff(date2Month(new Date()), 'month');
        step.value = currStep;
      }
    });

    const handleTouchEnd = () => {
      const { direction } = touch;
      if (isChangeMonth.value) {
        isChangeMonth.value = false;
      }
      if (direction.value === Direction.Left) {
        step.value++;
      }
      if (direction.value === Direction.Right) {
        step.value--;
      }
      touch.end();
    };

    handleTouchEnd;

    const PreMonth = () => (
      <div class='btn-pre-month'>
        <SvgIcon name='dropdown-item-left' onClick={() => step.value--} />
      </div>
    );

    const NextMonth = () => (
      <div class='btn-next-month'>
        <SvgIcon name='dropdown-item-right' onClick={() => step.value++} />
      </div>
    );

    const renderHeader = (lang, monthPicker) => {
      const { year, month } = panelData.value;
      return (
        <div class='calendar-header'>
          <div class='switch'>
            <ElTooltip content={MONTH_TOGGLE[lang].pre}>
              <PreMonth />
            </ElTooltip>
            {monthPicker ? monthPicker(formatDate(year, month, lang)) : <span class='date'>{formatDate(year, month, lang)}</span>}
            <ElTooltip content={MONTH_TOGGLE[lang].next}>
              <NextMonth />
            </ElTooltip>
          </div>
          <ElButton class='today-bottom' disabled={step.value === 0} size='small' onClick={() => (step.value = 0)}>
            {TODAY[lang]}
          </ElButton>
        </div>
      );
    };

    const renderWeek = (lang) => {
      return (
        <div class='weeks'>
          {WEEKS[lang].map((week, idx) => (
            <div key={week} class={weekBem({ wk: [5, 6].includes(idx) })}>{week}</div>
          ))}
        </div>
      );
    };

    const renderMonth = (lang) => {
      return (
        <>
          <Month lang={lang} step={step.value} isMobile={isMobile.value} {...attrs} />
          {isChangeMonth.value && (
            <div class='change-month'>
              {TOUCH_TIP[lang]}
            </div>
          )}
        </>
      );
    };

    return () => {
      const { lang, monthPicker } = props;
      return (
        <div class={[bem({ mobile: isMobile.value })]}>
          {renderHeader(lang, monthPicker)}
          {renderWeek(lang)}
          {renderMonth(lang)}
        </div>
      );
    };
  }
});

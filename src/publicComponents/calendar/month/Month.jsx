
import { getLevels, getPanelData } from '../utils';
import { FORMAT, SPACE, SPACE_MOBILE, DEFAULT_LIST_HEIGHT, DEFAULT_MOBILE_LIST_HEIGHT, MAX_LEVEL, MONTH_KEY } from '../constants';
import { useResize } from '../composable/useResize';
import chunk from 'lodash/chunk';

import Week from './Week';

import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from 'vue';
import { makeNumberProp, debounce, makeStringProp, makeArrayProp, makeObjectProp } from '@/utils';
import dayjs from 'dayjs';
import './index.less';

const props = {
  isMobile: Boolean,
  step: Number,
  tasks: makeObjectProp(),
  update: Function,
  lang: makeStringProp('zh'),
  dnd: makeArrayProp(),
  listStyle: Object,
  startListStyle: Object,
  warnText: String,
  rowMixCount: makeNumberProp(3),
  disabled: Boolean,
  resizable: Boolean,
  moreText: String,
  moveTaskId: String
};

export const Month = defineComponent({
  name: 'Month',
  props,
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const [Drag, Drop] = props.dnd;
    const panelData = computed(() => getPanelData(props.step));
    const weeks = computed(() => chunk(panelData.value.data, 7));
    const today = dayjs(new Date()).format(FORMAT);
    const space = props.isMobile ? SPACE_MOBILE : SPACE;
    const defaultListHeight = props.isMobile ? DEFAULT_MOBILE_LIST_HEIGHT : DEFAULT_LIST_HEIGHT;

    const calendarRef = ref(null);
    const width = ref();
    const height = ref([]);
    const calendarWidth = ref(0);
    const calendarHeights = reactive({
      clientHeight: 0,
      scrollHeight: 0
    });

    const handleResize = debounce(() => {
      calendarWidth.value = calendarRef.value.offsetWidth || 0;
      calendarHeights.clientHeight = calendarRef.value.clientHeight || 0;
      calendarHeights.scrollHeight = calendarRef.value.scrollHeight || 0;
    }, 200);

    // The equivalent of useEffect with dependency [step].
    watch(() => props.step, async () => {
      await nextTick();
      calendarWidth.value = calendarRef.value?.offsetWidth || 0;
      calendarHeights.clientHeight = calendarRef.value?.clientHeight || 0;
      calendarHeights.scrollHeight = calendarRef.value?.scrollHeight || 0;
      const monthElm = document.querySelector('.months');
      if (monthElm && monthElm.scrollTop) {
        monthElm.scrollTop = 0;
      }
    }, {immediate: true});

    watch(
      () => [props.step, calendarWidth],
      async() => {
        await nextTick();
        width.value = (calendarWidth.value / 7);
        const rows = calendarRef.value?.querySelectorAll('.week-row');
        const rowHeights = [];
        rows?.forEach(row => {
          rowHeights.push(row.scrollHeight);
        });
        height.value = rowHeights;
      },
      {immediate: true}
    );

    onMounted(() => {
      window.addEventListener('resize', handleResize, false);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize, false);
    });

    const resizeDay = ref(0);
    const setResizeDay = (day) => { resizeDay.value = day; };
    const { onResizeStart, resizeData } = useResize({
      height,
      width,
      setResizeDay,
      update: props.update,
      tasks: props.tasks
    });

    const resizeMsg = computed(() => {
      return resizeDay.value ? {
        id: resizeData.value?.id,
        day: resizeDay.value,
        direction: resizeData.value?.direction
      } : undefined;
    });

    const disableResize = computed(() => props.disabled || !props.resizable || !props.update);
    const listHeight = computed(() => props.listStyle?.height ? parseInt(props.listStyle?.height) : defaultListHeight);

    provide(MONTH_KEY, {
      space,
      listHeight,
      defaultListHeight,
      disableResize,
      onResizeStart,
      Drag,
      Drop,
      today,
      ...props
    });

    return () => {
      const { clientHeight, scrollHeight } = calendarHeights;
      const { rowMixCount, isMobile, tasks } = props;
      const { year, month } = panelData.value;

      return (

        <div ref={(ref) => (calendarRef.value = ref)} className='months' isMobile={isMobile} >
          {weeks.value.length > 0 && weeks.value.map((week, weekIdx) => {
            const levels = getLevels({ week, year, tasks: tasks.value, resizeMsg: resizeMsg.value });
            const rowLevel = Math.max(Math.min(levels.length, MAX_LEVEL), rowMixCount);
            let rowHeight = rowLevel * (listHeight.value + space) + defaultListHeight + 4 + 22;
            // Adaptive height when height is insufficient
            if (levels.length === 0 || (clientHeight <= scrollHeight && (clientHeight / weeks.value.length) > rowHeight)) {
              rowHeight = clientHeight / weeks.value.length;
            }
            return (
              <Week
                key={weekIdx}
                week={week}
                month={month}
                year={year}
                weekLevel={weekIdx}
                levelTasks={levels}
                rowHeight={rowHeight}
              />
            );
          })}
        </div>
      );
    };
  }
});

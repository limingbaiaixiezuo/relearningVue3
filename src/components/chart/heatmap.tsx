
import { ElEmpty } from 'element-plus';
import draw from './functions/draw/index';
import { useConvertUnit } from '@/utils/mg-use';
import { db } from './functions/dataBase';
import { convertUnitByValue } from './functions/unit';
import { debounce } from './functions/ui';
import { defineComponent, ref, watch, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { clearAllVisualizerLocalStorageData, clearEChartInstance } from './functions/clear';
import { chartDataCheck } from './functions/validate';
import { createNameSpace } from '../../utils/mg-utils';
// import './chart.less';

const [prefix] = createNameSpace('heatmap');

export default defineComponent({
  name: 'NonUniformGridHeatmap',
  components: {
    ElEmpty
  },
  props: {
    config: Object,
    table: Object
  },
  emits: ['vChartRenderEnd', 'showEmptyStopLoading'],
  setup(props, { emit, expose }) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { resultType, type, i18n } = props.config;

    const empty = ref(false);
    const dom = ref<HTMLDivElement>();

    const { baseUnit, currentUnit, convertUnit } = useConvertUnit(
      reactive({ unit: 'μm' })
    );

    const {
      baseUnit: fBaseUnit,
      currentUnit: fCurrentUnit,
      convertUnit: fConvertUnit
    } = useConvertUnit(reactive({ unit: 'THz' }));

    const {
      baseUnit: TBaseUnit,
      currentUnit: TCurrentUnit,
      // eslint-disable-next-line no-unused-vars
      convertUnit: TConvertUnit
    } = useConvertUnit(reactive({ unit: 'fs' }));

    const showEmpty = (dom: HTMLDivElement): void => {
      empty.value = true;
      emit('showEmptyStopLoading');
    };

    const drawChart = async(dom: HTMLDivElement | undefined): Promise<void> => {
      if (!chartDataCheck(dom, props, showEmpty)) {
        return;
      }

      clearEChartInstance();
      console.log('redraw');
      draw({ ...convertUnitByValue(props.config, {
        baseUnit,
        currentUnit,
        convertUnit,
        fBaseUnit,
        fCurrentUnit,
        fConvertUnit,
        TBaseUnit,
        TCurrentUnit,
        TConvertUnit
      }), dom, resultType: resultType });
      emit('vChartRenderEnd');
    };

    onMounted(async() => {
      await nextTick();
      redraw();
      window.addEventListener('resize', () => {
        resize();
      });
    });

    onBeforeUnmount(() => {
      clearAllVisualizerLocalStorageData();
    });

    const resize = async() => {
      db.startRAF = true;
      if (db.pTime > 30 && type !== 'multiLine') {
        console.log('resize debounceRedraw', db.pTime);
        debounceRedraw();
      } else {
        console.log('resize redraw', db.pTime);
        redraw();
      }
    };

    const debounceRedraw = debounce(async() => {
      redraw();
    }, 16.7, false);

    const redraw = async() => {
      empty.value = false;
      db.langName = i18n ?? 'en';
      drawChart(dom.value);
      db.startRAF = false;
    };

    expose({
      resize
    });

    watch(
      [
        () => currentUnit.value,
        () => fCurrentUnit.value,
        () => props.config,
        () => TCurrentUnit.value
      ],
      async([c1, c2, c3, c4], [p1, p2, p3, p4]) => {
        console.log('VChart data .....  更新');
        redraw();
      },
      { immediate: false, deep: true }
    );

    const renderChart = () => {
      
      return (
        <div
          ref={dom}
          class={prefix}
        />
      );
    };

    const renderEmpty = () => {
      return <ElEmpty image-size={200} description='No Data.' />;
    };
    // return () => (empty.value ? renderEmpty() : renderChart());
    return () => <div>Hello</div>;
  }
});

/* eslint-disable no-unused-vars */
import { defineComponent, reactive, watch, onMounted, onUnmounted, ref } from 'vue';
import {createNamespace, makeArrayProp, makeStringProp } from '@/utils';
import Popover from '../popover';

const [name, bem] = createNamespace('breadcrumb');

const props = {
  items: makeArrayProp([]),
  separator: makeStringProp(''),
  separatorIcon: makeStringProp('')// icon name
};

export default defineComponent({
  name,
  props,
  emits: ['jump'],
  setup(props, {emit, attrs, slots}) {
    const getWidth = () => {
      const activitybarWidth = ref(document.querySelector('.activitybar')?.clientWidth);
      const sidebarWidth = ref(document.querySelector('.sidebar')?.clientWidth);
      const useWindowSizeWIDTH = ref(window.innerWidth);
      if (!activitybarWidth.value || !sidebarWidth.value) return useWindowSizeWIDTH.value - 300;
      return useWindowSizeWIDTH.value - activitybarWidth.value - sidebarWidth.value;
    };

    const state = reactive({
      breadInfo: [],
      containerWidth: getWidth(),
      hideCrumbIndexes: [],
      renderCrumbsIndexes: [],
      renderPadding: 50
    });

    const calcCrumbsIndexes = (breadInfo, breadWidth) => {
      const breadsLen = breadInfo?.length;
      if (breadsLen <= 2) {
        return {
          hideCrumbIndexes: [],
          renderCrumbsIndexes: breadInfo.map((crumb) => crumb.index)
        };
      }

      let renderCrumbsIndexes = [];
      let hideCrumbIndexes = [];

      let renderNumbers = breadsLen;
      while (renderNumbers) {
        const hideWidthList = breadInfo.slice(1, breadsLen - renderNumbers + 1);
        const renderWidthList = [breadInfo[0], ...breadInfo.slice(hideWidthList.length + 1, breadsLen - 1), breadInfo[breadsLen - 1]];
        const totalWidth = renderWidthList.reduce((total, crumb) => {
          return total + crumb.width + state.renderPadding;
        }, 0);
        if (totalWidth <= breadWidth) {
          hideCrumbIndexes = unique(hideWidthList.map((crumb) => crumb.index));
          renderCrumbsIndexes = unique(renderWidthList.map((crumb) => crumb.index));
          break;
        }
        renderNumbers--;
      }

      if (breadsLen > 0 && renderCrumbsIndexes.length < 2) {
        return {
          hideCrumbIndexes: breadInfo.slice(1, breadsLen - renderNumbers + 1).map((crumb) => crumb.index),
          renderCrumbsIndexes: unique([0, breadsLen - 1])
        };
      }

      return {
        hideCrumbIndexes,
        renderCrumbsIndexes
      };
    };

    const init = (initType) => {
      state.containerWidth = getWidth();
      const { hideCrumbIndexes, renderCrumbsIndexes } = calcCrumbsIndexes(state.breadInfo, state.containerWidth);
      state.hideCrumbIndexes = hideCrumbIndexes;
      state.renderCrumbsIndexes = renderCrumbsIndexes;
      const container = document.querySelector('.o-breadcrumb__container');
      if (!container) return;
      container.setAttribute('style', `width: ${state.containerWidth - 280}px`);// TODO: bug, 依赖的宽度数据存在问题，布局问题
    };

    const calcTextWidth = (text, fontSize = 18, actualWidth = false) => {
      const fontFamily = window.getComputedStyle(document.body).getPropertyValue('font-family');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${fontSize}px ${fontFamily}`;
      context.textBaseline = 'ideographic';
      const metrics = context.measureText(text);

      if (metrics.width > 200 && !actualWidth) {
        return 200;
      };
      return metrics.width;
    };

    onMounted(() => {
      init();
      window.addEventListener('resize', () => { init(); });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', () => { init(); });
    });

    watch(() => props.items, (newVal, oldVal) => {
      try {
        state.breadInfo = props.items.map((crumb, index) => {
          return {
            id: crumb?.id,
            name: crumb?.name,
            renderName: crumb?.name,
            width: calcTextWidth(crumb?.name),
            index: index
          };
        });
        init();
      } catch (error) {
        console.log('breadcrumb error', error);
      }
    }, { immediate: true });

    const handleClick = (crumb) => {
      if (crumb.name === '...') return;
      emit('jump', crumb);
    };

    const unique = (arr) => {
      return Array.from(new Set(arr));
    };

    const renderBreadcrumbReference = (crumb) => {
      return (
        <>
          <span
            class={bem('show__render-crumb-btn')}
            onClick={() => handleClick(crumb)}
          >
            {crumb?.renderName === '...' ? <SvgIcon name='breadcrumb-ellipsis-btn' /> : crumb?.renderName}
          </span>
          {renderSeparator()}
        </>
      );
    };

    const renderSeparator = () => {
      const isDefaultSeparator = props.separatorIcon === '' && props.separator === '/';
      return (
        <span class={bem('show__render-crumb-btn-separator')}>
          {isDefaultSeparator ? props.separator : <SvgIcon name={props.separatorIcon} />}
        </span>
      );
    };

    const renderHideReference = (crumb) => {
      return (
        <div onClick={() => handleClick(crumb)} class={bem('hide-crumb-btn')}>{crumb.renderName}</div>
      );
    };

    const renderHideCrumbs = (hideData) => {
      return (
        <div class={bem('hide-crumbs')}>
          {hideData.map((crumb) => {
            return (
              <Popover
                placement='bottom-start'
                theme='light'
                v-slots={{
                  reference: () => renderHideReference(crumb)
                }}
              >
                <div class={bem('info')}>
                  <div class={bem('info-name')}>{crumb.name}</div>
                </div>
              </Popover>
            );
          })}
        </div>
      );
    };

    return () => {
      const data = state.breadInfo.filter((crumb, index) => {
        return state.renderCrumbsIndexes.includes(index);
      });

      if (state.hideCrumbIndexes.length) {
        data.splice(1, 0, {
          id: 'hide',
          name: '...',
          renderName: '...',
          width: calcTextWidth('...'),
          index: 1
        });
      }

      const hideData = state.breadInfo.filter((crumb, index) => {
        return state.hideCrumbIndexes.includes(index);
      });

      return (
        <div class={bem('container')}>
          {data.map((crumb) => {
            return (
              <div class={bem('show')}>
                <Popover
                  placement='bottom-start'
                  theme='light'
                  trigger={crumb.name === '...' ? 'click' : 'hover'}
                  v-slots={{reference: () => renderBreadcrumbReference(crumb)}}
                >
                  <div v-show={crumb.name === '...'} class={bem('info')}>
                    {
                      renderHideCrumbs(hideData)
                    }
                  </div>
                  <div v-show={crumb.name !== '...'} class={bem('info')}>
                    <div class={bem('info-name')}>{crumb.name}</div>
                  </div>
                </Popover>
              </div>
            );
          })}
        </div>
      );
    };
  }
});

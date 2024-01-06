import { makeArrayProp, makeNumberProp, createNamespace, addUnit } from '@/utils';
import { useVirtualData } from './composable';

const [name, bem] = createNamespace('virtual-scroller');

const props = {
  cache: makeNumberProp(2),
  items: makeArrayProp(),
  itemHeight: makeNumberProp(30)
};

export default {
  name,
  props,
  setup(props, {slots}) {
    const {totalHeight, scrollWrapRef, scrollHandler, visibleItems, startVisibleIndex} = useVirtualData(props);

    const renderContent = () => {
      const {itemHeight} = props;
      const contentStyle = {
        minHeight: addUnit(totalHeight.value)
      };

      return (
        <div class={bem('content')} style={contentStyle}>
          {visibleItems.value.map((item, index) => {
            const realIndex = startVisibleIndex.value + index;
            const itemStyle = {
              height: addUnit(itemHeight),
              transform: `translateY(${(realIndex) * itemHeight}px)`
            };

            return (
              <div class={bem('item')} style={itemStyle}>
                {
                  slots.default ? slots.default({item, index: realIndex}) : item
                }
              </div>
            );
          }
          )}
        </div>
      );
    };

    return () => {
      return (
        <div class={name} ref={scrollWrapRef} onScroll={scrollHandler}>
          {renderContent()}
        </div>

      );
    };
  }
};

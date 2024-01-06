import { Transition, defineComponent } from 'vue';
import { isDefine, extend, truthProp, numericProp, unknownProp, createNamespace, getZIndexStyle } from '@/utils';

import { useLazyRender } from '@/composable';

const [name, bem] = createNamespace('overlay');

const overlayProps = {
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object
};

export default defineComponent({
  name,
  props: overlayProps,
  setup(props, {slots}) {
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);

    const preventTouchMove = (event) => {
      event.preventDefault();
    };

    const renderOverlay = lazyRender(() => {
      const style = extend(
        getZIndexStyle(props.zIndex),
        props.customStyle
      );

      if (isDefine(props.duration)) style.duration = `${props.duration}s`;

      return (
        <div
          v-show={props.show}
          style={style}
          class={[bem(), props.className]}
          onTouchmove={props.lockScroll ? preventTouchMove : null}
        >
          {slots.default?.()}
        </div>
      );
    });

    return () => (
      <Transition
        name='o-fade'
        appear
        v-slots={{default: renderOverlay}}
      />
    );
  }
});

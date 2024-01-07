import {computed, defineComponent} from 'vue';
import {createNamespace, makeStringProp, numericProp, makeBooleanProp, addUnit, isDefine, isNumeric } from '@/utils';

const [name, bem] = createNamespace('badge');

const props = {
  content: numericProp,
  color: String,
  dot: Boolean,
  tag: makeStringProp('div'),
  max: numericProp,
  offset: Array,
  showZero: makeBooleanProp(true),
  position: makeStringProp('top-right')
};

export default defineComponent({
  name,
  props,
  setup(props, { slots}) {
    const hasContent = () => {
      if (slots.content) {
        return true;
      }
      const { content, showZero } = props;
      return (
        isDefine(content) &&
        content !== '' &&
        (showZero || (content !== 0 && content !== '0'))
      );
    };

    const renderContent = () => {
      const { dot, max, content } = props;

      if (!dot && hasContent()) {
        if (slots.content) {
          return slots.content();
        }

        if (isDefine(max) && isNumeric(content) && +content > +max) {
          return `${max}+`;
        }

        return content;
      }
    };

    const getOffsetWithMinusString = (val) =>
      val.startsWith('-') ? val.replace('-', '') : `-${val}`;

    const style = computed(() => {
      const style = {
        background: props.color
      };

      if (props.offset) {
        const [x, y] = props.offset;
        const { position } = props;
        const [offsetY, offsetX] = position.split('-');
        if (slots.default) {
          if (typeof y === 'number') {
            style[offsetY] = addUnit(offsetY === 'top' ? y : -y);
          } else {
            style[offsetY] =
              offsetY === 'top' ? addUnit(y) : getOffsetWithMinusString(y);
          }

          if (typeof x === 'number') {
            style[offsetX] = addUnit(offsetX === 'left' ? x : -x);
          } else {
            style[offsetX] =
              offsetX === 'left' ? addUnit(x) : getOffsetWithMinusString(x);
          }
        } else {
          style.marginTop = addUnit(y);
          style.marginLeft = addUnit(x);
        }
      }

      return style;
    });

    const renderBadge = () => {
      if (hasContent() || props.dot) {
        return (
          <div
            class={bem([
              props.position,
              { dot: props.dot, fixed: !!slots.default }
            ])}
            style={style.value}
          >
            {renderContent()}
          </div>
        );
      }
    };

    return () => {
      if (slots.default) {
        const { tag } = props;
        return (
          <tag class={bem('wrapper')}>
            {slots.default()}
            {renderBadge()}
          </tag>
        );
      }

      return renderBadge();
    };
  }
});

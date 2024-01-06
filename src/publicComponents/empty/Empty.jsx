import {defineComponent} from 'vue';
import {createNamespace, makeStringProp, getSizeStyle } from '@/utils';
import i18n from '@/language/index';
const { t } = i18n.global;

const [name, bem] = createNamespace('empty');

const props = {
  image: makeStringProp('default'),
  imageSize: [String, Number, Array],
  description: makeStringProp('noData')
};

export default defineComponent({
  name,
  props,
  setup(props, {emit, attrs, slots}) {
    const renderImage = () => {
      if (slots.image) return slots.image();

      return (
        <img src={props.image} />
      );
    };

    const renderDescription = () => {
      const description = slots.description
        ? slots.description()
        : props.description;

      if (description) {
        return <p class={bem('description')}>{t(description)}</p>;
      }
    };

    const renderBottom = () => {
      if (slots.default) {
        return <div class={bem('bottom')}>{slots.default()}</div>;
      }
    };

    return () => {
      return (
        <div class={bem()}>
          <div class={bem('image')} style={getSizeStyle(props.imageSize)}>
            {renderImage()}
          </div>
          {renderDescription()}
          {renderBottom()}
        </div>
      );
    };
  }
});

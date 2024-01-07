import { defineComponent } from 'vue';
import { IMAGE_STYLE } from '@/constant';
import {createNamespace, makeStringProp, makeNumberProp, addUnit } from '@/utils';
import Popover from '../popover';
import Badge from '../badge';
import { SvgIcon } from '../components';

const [name, bem] = createNamespace('avatar');

const props = {
  src: String,
  showName: Boolean,
  showBadge: Boolean,
  online: Boolean,
  size: makeNumberProp(34),
  shape: makeStringProp(''),
  alt: makeStringProp(''),
  name: makeStringProp(''),
  email: makeStringProp('')
};

export default defineComponent({
  name,
  props,
  setup(props, {emit, attrs, slots}) {
    const renderBadgeContent = () => {
      if (!props.showBadge) return null;
      return (
        <SvgIcon name='master-crown' />
      );
    };

    const renderReference = () => {
      return (
        <div
          class={bem({online: props.online})}
        >
          <Badge
            position='top-left'
            offset={[3, 3]}
            v-slots={{
              content: renderBadgeContent
            }}
            style={{
              width: addUnit(props.size),
              height: addUnit(props.size)
            }}
          >
            <img class={bem('img')} src={props.src + IMAGE_STYLE.PREVIEW} alt={props.alt} />
          </Badge>
          {props.showName && <span class={bem('name')}>{props.name}</span>}
        </div>
      );
    };

    return () => {
      return (
        <Popover
          class={bem('Popover')}
          placement='top'
          theme='light'
          v-slots={{
            reference: renderReference
          }}
        >
          <div class={bem('info')}>
            <img src={props.src + IMAGE_STYLE.THUMBNAIL} alt={props.alt}/>
            <div class={bem('info-name')}>{props.name}</div>
          </div>
          <div class={bem('email')}>
            <SvgIcon name='send'></SvgIcon>
            {props.email}
          </div>
        </Popover>

      );
    };
  }
});

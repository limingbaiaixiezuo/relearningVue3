/*
 * @Author: yinmingdi
 * @Date: 2022-03-11 16:11:30
 * @Description:
 *
 */

import { defineComponent, inject } from 'vue';
import SvgIcon from '../svg-icon/index.vue';
import { createNamespace } from '@/utils';

const [name, bem] = createNamespace('context-menu-item');
export const ContextMenuItem = defineComponent({
  name: name,
  props: {
    item: {
      type: Object
    },
    active: {
      type: Boolean
    }
  },
  setup(props, attrs) {
    const root = inject('contextMenuRoot');
    const itemClick = (e) => {
      const { item } = props;
      if (item.disabled) return;
      root.value.close();
      item.onClick?.(e, root.value.binding, item, root.value.items);
    };

    return () => {
      const { item, active } = props;
      if (item.hidden) return null;

      const itemClass = bem({
        'disabled': item.disabled,
        'active': active
      });
      const itemBoxClass = bem({
        'box': true,
        'divided': item.divided
      });
      return (
        <div class={itemBoxClass}>
          <div
            class={itemClass}
            onClick={itemClick}
          >
            <SvgIcon class={bem('icon')} name={item.icon}/>
            <span class={bem('title')}>{item.label}</span>
            {item.children &&
          <span class={bem('arrow')}>
            <SvgIcon name={'dropdown-item-right'}/>
          </span>}
          </div>
        </div>
      );
    };
  }
});

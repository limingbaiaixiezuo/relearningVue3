/*
 * @Author: yinmingdi
 * @Date: 2022-03-04 16:51:25
 * @Description:右击菜单vue版本
 *
 */

import { defineComponent, ref, getCurrentInstance, nextTick, reactive, watch, provide, computed } from 'vue';
import { getPosition, resetDirection } from './ContextMenuPosition';
import { ContextMenuItem } from './ContextMenuItem';
import { makeArrayProp, numericProp, unknownProp, createNamespace, deepClone, deepAssign, makeNumberProp } from '@/utils';
import { useClickAway, useEventListener } from '@/composable';

const defaultState = {
  activeMenuItem: null
};

const [prefixName] = createNamespace('context-menu');
const props = {
  visible: Boolean,
  items: makeArrayProp(),
  x: numericProp,
  y: numericProp,
  width: makeNumberProp(0),
  height: makeNumberProp(0),
  binding: unknownProp
};

const ContextMenu = defineComponent({
  name: 'ContextMenu',
  props,
  emits: ['update:show', 'close'],

  setup(props, { emit, slots }) {
    const menu = ref();
    const instance = getCurrentInstance();
    const state = reactive(deepClone(defaultState));
    const topLevel = instance.parent === null;
    const menuPosition = reactive({
      y: 0,
      x: 0
    });
    const submenuPosition = reactive({
      y: 0,
      x: 0
    });

    const updateShow = (value) => emit('update:show', value);

    const close = () => {
      emit('close');
      updateShow(false);
      resetState();
      resetDirection();
    };

    const resetState = () => {
      Object.assign(state, defaultState);
    };

    const isActive = (item) => state.activeMenuItem?.label === item.label;

    const setMenuStyle = async() => {
      await nextTick();
      const parentPosition = { ...props };
      const selfPosition = menu.value.getBoundingClientRect();
      const position = getPosition(parentPosition, selfPosition, topLevel);

      deepAssign(menuPosition, position);
      deepAssign(submenuPosition, position);
    };

    const setActiveMenuItem = (e, menuItem) => {
      if (menuItem.disabled) return;
      submenuPosition.y = e.target.getBoundingClientRect().top;
      state.activeMenuItem = menuItem;
    };

    watch(
      () => [props.visible, props.x, props.y],
      ([visible]) => {
        if (visible) {
          resetState();
          setMenuStyle();
          if (topLevel) resetDirection();
        } else {
          resetState();
        }
      },
      { immediate: true }
    );

    const mountTopLevel = async () => {
      if (!topLevel) return;
      const contextMenuRoot = computed(() => ({
        close,
        binding: props.binding,
        items: props.items
      }));

      provide('contextMenuRoot', contextMenuRoot);
      useClickAway(menu, close, {eventName: 'mousedown'});
      useEventListener('resize', close);
      useEventListener('scroll', close);
    };

    mountTopLevel();

    const renderMenuItem = (item) => {
      return (
        <ContextMenuItem
          item={item}
          active={isActive(item)}
          onMouseenter={(e) => { setActiveMenuItem(e, item); }}
        />
      );
    };

    const renderSubmenu = (item) => {
      return (
        <>
          { renderMenuItem(item) }
          {
            <ContextMenu
              visible={isActive(item)}
              items={item.children}
              x={submenuPosition.x}
              y={submenuPosition.y}
              width={submenuPosition.width}
              height={submenuPosition.height}
            />
          }
        </>
      );
    };

    return () => {
      const { items, visible } = props;
      if (!items || !visible) return null;
      const menuStyle = {
        left: menuPosition.x + 'px',
        top: menuPosition.y + 'px'
      };

      return (
        <div class={prefixName} style={menuStyle} ref={menu} onContextmenu={(e) => e.preventDefault()}>
          {
            props.items.map((item) => {
              return item.children ? renderSubmenu(item) : renderMenuItem(item);
            })
          }
        </div>
      );
    };
  }

});

export default ContextMenu;

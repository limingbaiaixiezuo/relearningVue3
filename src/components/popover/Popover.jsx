import {
  ref,
  watch,
  nextTick,
  onMounted,
  watchEffect,
  onBeforeUnmount,
  defineComponent,
  Fragment
} from 'vue';
import { createPopper } from '@popperjs/core';
import { BORDER_RIGHT, BORDER_BOTTOM} from '@/constant/components';

// Utils
import {
  pick,
  inBrowser,
  truthProp,
  numericProp,
  unknownProp,
  makeArrayProp,
  makeStringProp,
  createNamespace
} from '@/utils';

// Composables
import { useClickAway } from '@/composable';
import { useSyncPropRef } from '@/composable';

// Components
import { Popup } from '../popup';
import SvgIcon from '../svg-icon/index.vue';

const [name, bem] = createNamespace('popover');

const popupProps = [
  'overlay',
  'duration',
  'teleport',
  'overlayStyle',
  'overlayClass',
  'closeOnClickOverlay'
];

export const popoverProps = {
  show: Boolean,
  manual: Boolean,
  theme: makeStringProp('light'),
  overlay: Boolean,
  actions: makeArrayProp(),
  actionsDirection: makeStringProp('vertical'),
  trigger: makeStringProp('hover'),
  duration: numericProp,
  showArrow: truthProp,
  placement: makeStringProp('bottom'),
  iconPrefix: String,
  overlayClass: unknownProp,
  overlayStyle: Object,
  closeOnClickAction: truthProp,
  closeOnClickContent: Boolean,
  closeOnClickOverlay: truthProp,
  closeOnClickOutside: truthProp,
  disabled: Boolean,
  offset: {
    type: Array,
    default: () => [0, 8]
  },
  teleport: {
    type: [String, Object],
    default: 'body'
  }
};

export default defineComponent({
  name,

  props: popoverProps,

  emits: ['select', 'touchstart', 'update:show'],

  setup(props, { emit, slots, attrs }) {
    let popper;

    const popupRef = ref();
    const wrapperRef = ref();
    const popoverRef = ref();
    const arrowRef = ref();

    const show = useSyncPropRef(
      () => props.show,
      (value) => emit('update:show', value)
    );

    const getPopoverOptions = () => ({
      placement: props.placement,
      modifiers: [
        {
          name: 'computeStyles',
          options: {
            adaptive: false,
            gpuAcceleration: false
          }
        },
        {
          name: 'preventOverflow',
          options: {
            padding: {
              top: 2,
              bottom: 2,
              left: 5,
              right: 5
            }
          }
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top', 'bottom']
          }
        },
        {
          name: 'arrow',
          options: {
            element: arrowRef.value
          }
        },
        {
          name: 'offset',
          options: {
            offset: props.offset
          }
        }
      ]
    });

    const createPopperInstance = () => {
      if (wrapperRef.value && popoverRef.value) {
        return createPopper(
          wrapperRef.value,
          popoverRef.value.popupRef.value,
          getPopoverOptions()
        );
      }
      return null;
    };

    const updateLocation = () => {
      nextTick(() => {
        if (!show.value) {
          return;
        }

        if (!popper) {
          popper = createPopperInstance();
          if (inBrowser) {
            window.addEventListener('animationend', updateLocation);
            window.addEventListener('transitionend', updateLocation);
          }
        } else {
          popper.setOptions(getPopoverOptions());
        }
      });
    };

    const updateShow = (value) => {
      show.value = value;
    };

    const toggle = () => {
      if (props.disabled) return;
      show.value = !show.value;
    };

    const close = () => {
      if (props.manual) return;
      show.value = false;
    };

    const open = () => {
      if (props.disabled || props.manual) return;
      show.value = true;
    };

    const onClickAction = (action, index) => {
      if (action.disabled) {
        return;
      }

      emit('select', action, index);

      if (props.closeOnClickAction) {
        close();
      }
    };

    const setWrapperRef = (el) => {
      if (el) {
        wrapperRef.value = el.nextElementSibling;
      } else {
        wrapperRef.value = null;
      }
    };

    const onClickAway = () => {
      if (
        show.value &&
        props.closeOnClickOutside &&
        (!props.overlay || props.closeOnClickOverlay)
      ) {
        close();
      }
    };

    const onClickContent = () => {
      if (props.closeOnClickContent) {
        close();
      }
    };

    const whenTrigger = (trigger, handler) => {
      return (e) => {
        if (trigger === props.trigger) handler(e);
      };
    };

    const events = {
      click: whenTrigger('click', toggle),
      mouseenter: whenTrigger('hover', open),
      mouseleave: whenTrigger('hover', close)
    };

    const setEvents = (el, events, type) => {
      if (!el) return;
      Object.entries(events).forEach(([name, handler]) => {
        el[type](name, handler);
      });
    };

    watch(
      () => wrapperRef.value,
      (wrapperEl, preWrapperEl) => {
        setEvents(wrapperEl, events, 'addEventListener');
        setEvents(preWrapperEl, events, 'removeEventListener');
      }
    );

    watch(() => [show.value, props.offset, props.placement], updateLocation);

    useClickAway([wrapperRef, popupRef], onClickAway, {
      eventName: 'click'
    });

    onMounted(() => {
      updateLocation();
      watchEffect(() => {
        popupRef.value = popoverRef.value?.popupRef.value;
        setEvents(wrapperRef.value, events, 'addEventListener');
      });
    });

    onBeforeUnmount(() => {
      if (popper) {
        if (inBrowser) {
          window.removeEventListener('animationend', updateLocation);
          window.removeEventListener('transitionend', updateLocation);
        }
        popper.destroy();
        popper = null;
      }
      setEvents(wrapperRef.value, events, 'removeEventListener');
    });

    const renderActionContent = (action, index) => {
      if (slots.action) {
        return slots.action({ action, index });
      }

      return [
        action.icon && (
          <SvgIcon
            name={action.icon}
            classPrefix={props.iconPrefix}
            class={bem('action-icon')}
          />
        ),
        <div
          class={[
            bem('action-text'),
            { [BORDER_BOTTOM]: props.actionsDirection === 'vertical' }
          ]}
        >
          {action.text}
        </div>
      ];
    };

    const renderAction = (action, index) => {
      const { icon, color, disabled, className } = action;
      return (
        <div
          role='menuitem'
          class={[
            bem('action', { disabled, 'with-icon': icon }),
            { [BORDER_RIGHT]: props.actionsDirection === 'horizontal' },
            className
          ]}
          style={{ color }}
          tabindex={disabled ? undefined : 0}
          aria-disabled={disabled || undefined}
          onClick={() => onClickAction(action, index)}
        >
          {renderActionContent(action, index)}
        </div>
      );
    };

    return () => {
      const [reference] = slots.reference?.();
      return (
        <Fragment ref={setWrapperRef} class={bem('wrapper')}>
          {reference}
          <Popup
            ref={popoverRef}
            show={show.value}
            class={bem([props.theme])}
            position={''}
            transition='o-popover-zoom'
            lockScroll={false}
            onUpdate:show={updateShow}
            {...attrs}
            {...pick(props, popupProps)}
          >
            {props.showArrow && <div class={bem('arrow')} ref={arrowRef} />}
            <div role='menu' class={bem('content', props.actionsDirection)} onClick={onClickContent}>
              {slots.default ? slots.default() : props.actions.map(renderAction)}
            </div>
          </Popup>
        </Fragment>

      );
    };
  }
});

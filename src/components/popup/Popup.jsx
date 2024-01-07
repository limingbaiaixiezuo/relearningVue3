import { computed, defineComponent, onDeactivated, onMounted, provide, ref, Transition, Teleport, watch } from 'vue';
import { createNamespace, extend, makeStringProp } from '@/utils';
import { useExpose, useLazyRender } from '@/composable';
import { popupSharedProps} from './shared';
import { isDefine, callInterceptor } from '@/utils';
import SvgIcon from '../svg-icon/index.vue';
import {Overlay} from '../overlay';

const [name, bem] = createNamespace('popup');
let globalZIndex = 2000;

const popupProps = extend({}, popupSharedProps, {
  round: Boolean,
  position: makeStringProp('center'),
  closeIcon: makeStringProp('call-off'),
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  closeOnPopstate: Boolean,
  closeIconPosition: makeStringProp('top-right'),
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean
});

export default defineComponent({
  name,
  inheritAttrs: false,
  props: popupProps,

  emits: [
    'open',
    'close',
    'opened',
    'closed',
    'keydown',
    'update:show',
    'click-overlay',
    'click-close-icon'
  ],
  setup(props, {emit, attrs, slots}) {
    let opened;

    const zIndex = ref();
    const popupRef = ref();

    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);

    const style = computed(() => {
      const style = {
        zIndex: zIndex.value
      };

      if (isDefine(props.duration)) {
        const key = props.position === 'center'
          ? 'animationDuration'
          : 'transitionDuration';
        style[key] = `${props.duration}`;
      }

      return style;
    });

    const open = () => {
      if (opened) return;

      if (props.zIndex !== undefined) {
        globalZIndex = +props.zIndex;
      }

      opened = true;
      zIndex.value = ++globalZIndex;

      emit('open');
    };

    const close = () => {
      if (!opened) return;

      callInterceptor(props.beforeClose, {
        done() {
          opened = false;
          emit('close');
          emit('update:show', false);
        }
      });
    };

    const onClickOverlay = (event) => {
      emit('click-overlay', event);

      if (props.closeOnClickOverlay) close();
    };

    const renderOverlay = () => {
      if (!props.overlay) return;

      return (
        <Overlay
          v-slots={{default: slots['overlay-content']}}
          show={props.show}
          class={props.overlayClass}
          zIndex={zIndex.value}
          duration={props.duration}
          customStyle={props.overlayStyle}
          onClick={onClickOverlay}
        />
      );
    };

    const onClickCloseIcon = (event) => {
      emit('click-close-icon', event);
      close();
    };

    const renderCloseIcon = () => {
      if (!props.closeable) return;
      return (
        <SvgIcon
          role='button'
          tabindex={0}
          name={props.closeIcon}
          onClick={onClickCloseIcon}
          class={[
            bem('close-icon', props.closeIconPosition)
          ]}
        />
      );
    };

    const onOpened = () => emit('opened');
    const onClosed = () => emit('closed');
    const onKeydown = (event) => emit('keydown', event);

    const renderPopup = lazyRender(() => {
      const { round, position } = props;

      return (
        <div
          v-show={props.show}
          ref={popupRef}
          style={style.value}
          class={[
            bem({
              round,
              [position]: position
            })
          ]}
          onKeyDown={onKeydown}
          {...attrs}
        >
          {renderCloseIcon()}
          {slots.default?.()}
        </div>
      );
    });

    const renderTransition = () => {
      const {position, transition} = props;
      const name = position === 'center'
        ? 'o-fade'
        : `o-popup-slide-${position}`;

      return (
        <Transition
          v-slots={{default: renderPopup}}
          name={transition || name}
          onAfterEnter={onOpened}
          onAfterLeave={onClosed}
        />

      );
    };

    watch(
      () => props.show,
      (show) => {
        if (show && !opened) {
          open();
        }

        if (!show && opened) {
          opened = false;
          emit('close'); ;
        }
      }
    );

    useExpose({popupRef});

    onMounted(() => {
      if (props.show) {
        open();
      }
    });

    onDeactivated(() => {
      // teleported popup should be closed when deactivated
      if (props.show && props.teleport) {
        close();
      }
    });

    provide('POPUP_TOGGLE_KEY', () => props.show);

    return () => {
      if (props.teleport) {
        return (
          <Teleport to={props.teleport}>
            {renderOverlay()}
            {renderTransition()}
          </Teleport>
        );
      }

      return (
        <>
          {renderOverlay()}
          {renderTransition()}
        </>
      );
    };
  }
});

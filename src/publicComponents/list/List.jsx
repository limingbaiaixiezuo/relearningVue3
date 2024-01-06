import {defineComponent, onMounted, ref, watch, unref, nextTick, onUpdated} from 'vue';
import {createNamespace, makeStringProp, makeNumericProp, truthProp } from '@/utils';
import { useEventListener, useExpose, useRect, useScrollParent } from '@/composable';
import Loading from '../loading/Loading';

const [name, bem] = createNamespace('list');

const DIRECTION = {
  UP: 'up',
  DOWN: 'down'
};

const props = {
  error: Boolean,
  offset: makeNumericProp(300),
  loading: Boolean,
  disabled: Boolean,
  finished: Boolean,
  errorText: String,
  direction: makeStringProp(DIRECTION.DOWN),
  loadingText: String,
  finishedText: String,
  immediateCheck: truthProp
};

function isHidden(
  elementRef
) {
  const el = unref(elementRef);
  if (!el) {
    return false;
  }

  const style = window.getComputedStyle(el);
  const hidden = style.display === 'none';

  const parentHidden = el.offsetParent === null && style.position !== 'fixed';

  return hidden || parentHidden;
}

export default defineComponent({
  name,
  props,
  emits: ['load', 'update:loading', 'update:error'],
  setup(props, {emit, attrs, slots}) {
    const loading = ref(props.loading);
    const root = ref(null);
    const tabStatus = null;
    const placeholder = ref(null);
    const scrollParent = useScrollParent(root);

    const check = async () => {
      await nextTick();
      if (loading.value || props.finished || props.error || props.disabled) {
        return;
      }

      const { direction } = props;
      const offset = +props.offset;
      const scrollParentRect = useRect(scrollParent);

      if (!scrollParentRect.height || isHidden(root)) {
        return;
      }

      let isReachEdge = false;
      const placeholderRect = useRect(placeholder);
      if (direction === DIRECTION.UP) {
        isReachEdge = scrollParentRect.top - placeholderRect.top <= offset;
      } else {
        isReachEdge =
          placeholderRect.bottom - scrollParentRect.bottom <= offset;
      }

      if (isReachEdge) {
        loading.value = true;
        emit('update:loading', true);
        emit('load');
      }
    };

    watch(() => [props.loading, props.finished, props.error], check);

    if (tabStatus) {
      watch(tabStatus, (tabActive) => {
        if (tabActive) {
          check();
        }
      });
    }

    onUpdated(() => {
      loading.value = props.loading;
    });

    onMounted(() => {
      if (props.immediateCheck) {
        check();
      }
    });

    useExpose({check});

    useEventListener('scroll', () => {
      check();
    }, {target: scrollParent, passive: true});

    const renderLoading = () => {
      if (loading.value && !props.finished && !props.disabled) {
        return (
          <div class={bem('loading')}>
            {
              slots.loading
                ? slots.loading()
                : <Loading class={bem('loading-icon')}>
                  {props.loadingText || 'loading'}
                </Loading>
            }
          </div>
        );
      }
    };

    const renderFinishedText = () => {
      if (props.finished) {
        const text = slots.finished ? slots.finished() : props.finishedText;
        if (text) {
          return <div class={bem('finished-text')}>{text} </div>;
        }
      }
    };

    const clickErrorText = () => {
      emit('update:error', false);
      check();
    };

    const renderErrorText = () => {
      if (props.error) {
        const text = slots.error ? slots.error() : props.errorText;
        if (text) {
          return (
            <div
              role='button'
              class={bem('error-text')}
              tabindex={0}
              onClick={clickErrorText}
            >
              {text}
            </div>
          );
        }
      }
    };

    return () => {
      const Content = slots.default?.();
      const Placeholder = <div ref={placeholder} class={bem('placeholder')} />;

      return (
        <div ref={root} class={bem()}>
          {props.direction === DIRECTION.DOWN ? Content : Placeholder}
          {renderLoading()}
          {renderFinishedText()}
          {renderErrorText()}
          {props.direction === DIRECTION.UP ? Content : Placeholder}
        </div>
      );
    };
  }
});

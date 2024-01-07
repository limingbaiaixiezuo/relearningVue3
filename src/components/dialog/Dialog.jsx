import { createNamespace, makeStringProp, unknownProp, truthProp } from '@/utils';
import { ElButton, ElDialog } from 'element-plus';
import { defineComponent, reactive } from 'vue';

import i18n from '@/language/index';
const { t } = i18n.global;

const [name] = createNamespace('dialog');
const props = {
  beforeClose: unknownProp,
  showConfirmButton: truthProp,
  confirmButtonText: makeStringProp('confirm'),
  confirmButtonDisabled: Boolean,

  showCancelButton: Boolean,
  cancelButtonText: makeStringProp('cancel'),
  cancelButtonDisabled: Boolean

};

export default defineComponent({
  name,

  props,

  emits: ['confirm', 'cancel', 'update:modelValue'],

  setup(props, {attrs, slots, emit}) {
    const loading = reactive({
      cancel: false,
      confirm: false
    });

    const close = (action) => {
      emit('update:modelValue', false);
    };

    const getActionHandler = (action) => () => {
      emit(action);

      const done = (isClose = true) => {
        isClose && close(action);
        // loading[action] = false;
        loading.cancel = false;
        loading.confirm = false;
      };

      if (props.beforeClose) {
        loading[action] = true;
        props.beforeClose(action, done);
      } else {
        close(action);
      }
    };

    const cancelHandler = getActionHandler('cancel');
    const confirmHandler = getActionHandler('confirm');

    const renderFooter = () => {
      const {showCancelButton, cancelButtonDisabled, cancelButtonText, showConfirmButton, confirmButtonDisabled, confirmButtonText} = props;
      return (
        <div>
          {
            showCancelButton &&
          <ElButton
            onClick={cancelHandler}
            disabled={cancelButtonDisabled}
            loading={loading.cancel}
          >
            {t(cancelButtonText)}
          </ElButton>
          }

          {
            showConfirmButton &&
            <ElButton
              type='primary'
              onClick={confirmHandler}
              disabled={confirmButtonDisabled}
              loading={loading.confirm}
            >
              {t(confirmButtonText)}
            </ElButton>
          }
        </div>
      );
    };

    const getFooter = () => {
      const {showCancelButton, showConfirmButton } = props;
      const isHiddenFooter = !showCancelButton && !showConfirmButton;
      return isHiddenFooter ? null : renderFooter;
    };

    return () => {
      const realSlots = {
        footer: getFooter(),
        ...slots
      };

      return (
        <ElDialog
          {...attrs}
          beforeClose={cancelHandler}
          v-slots={realSlots}
        >

        </ElDialog>
      );
    };
  }
});

<template>
  <ElInput
    ref="inputDOM"
    :autocomplete="type!=='password'?'off':'new-password'"
    :type="type"
    v-bind="$attrs"
    :class="[bem([size])]"
  >
    <template
      v-for="(index, name) in $slots"
      #[name]
    >
      <slot :name="name" />
    </template>
  </ElInput>
</template>
<script>
import { defineComponent, nextTick, ref } from 'vue';
import {createNamespace} from '@/utils';
const [name, bem] = createNamespace('input');
export default defineComponent({
  name,
  props: {
    size: {
      type: String,
      default: 'default'
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  setup(props, {expose}) {
    const inputDOM = ref(null);
    const inputFocus = () => {
      nextTick(() => {
        inputDOM.value && inputDOM.value.focus();
      });
    };
    expose({
      inputFocus,
      getEl: () => inputDOM.value?.input || inputDOM.value?.textarea
    });
    return {bem, inputDOM, inputFocus};
  }
});
</script>
<style lang="less" scoped>
  @import './index.less' ;
</style>

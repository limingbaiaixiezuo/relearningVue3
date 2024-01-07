<template>
  <ElSelect
    v-bind="$attrs"
    :class="[bem([size, type])]"
    :popper-class="bem([size, type])"
    fit-input-width
  >
    <template
      v-for="(index, name) in $slots"
      #[name]
    >
      <slot :name="name" />
    </template>
  </ElSelect>
</template>
<script>
import { defineComponent } from 'vue';
import { createNamespace } from '@/utils';
const [name, bem] = createNamespace('select');
export default defineComponent({
  name,
  props: {
    size: {
      type: String,
      default: 'default'
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  setup(props) {
    return {bem};
  }
});
</script>
<style lang="less" scoped>
  @import './index.less' ;
</style>

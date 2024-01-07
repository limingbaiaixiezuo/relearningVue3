<template>
  <ElDropdown
    v-bind="$attrs"
    :class="[bem([size, type])]"
  >
    <template
      v-for="(index, name) in $slots"
      #[name]
    >
      <slot :name="name" />
    </template>
  </ElDropdown>
</template>
<script>
import { defineComponent } from 'vue';
import { createNamespace } from '@/utils';
const [name, bem] = createNamespace('dropdown');
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
<style lang="less">
  @import './index.less' ;
</style>

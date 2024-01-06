<template>
  <ElDropdownMenu
    v-bind="$attrs"
    :class="[bem([size, type])]"
  >
    <template
      v-for="(index, name) in $slots"
      #[name]
    >
      <slot :name="name" />
    </template>
  </ElDropdownMenu>
</template>
<script>
import { defineComponent } from 'vue';
import { createNamespace } from '@/utils';
const [name, bem] = createNamespace('dropdown-menu');
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
    return { bem };
  }
});
</script>
<style lang="less" scoped>
  @import "./index.less" ;
</style>

<template>
  <ElCascade
    v-bind="$attrs"
    :class="[bem([size, type])]"
    :option="option"
    :props="props"
  >
    <template
      v-for="(index, name) in $slots"
      #[name]
    >
      <slot :name="name" />
    </template>
  </ElCascade>
</template>
<script>
import { defineComponent } from 'vue';
import {ElCascade} from 'element-plus';
import { createNamespace } from '@/utils';
const [name, bem] = createNamespace('cascade');
export default defineComponent({
  name,
  components: {
    ElCascade
  },
  props: {
    size: {
      type: String,
      default: 'default'
    },
    type: {
      type: String,
      default: 'default'
    },
    option: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    return {bem};
  }
});
</script>
<style lang="less" scoped>
  @import "./index.less" ;
</style>

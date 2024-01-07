<template>
  <ElAlert
    v-bind="$attrs"
    :class="[bem([type,size])]"
  >
    <template
      v-for="(index,name) in $slots"
      #[name]
    >
      <slot :name="name" />
    </template>
  </ElAlert>
</template>

<script>
import { defineComponent } from 'vue';
import { createNamespace } from '@/utils';
import {ElAlert} from 'element-plus';

const [name, bem] = createNamespace('alert');
export default defineComponent({
  name,
  components: {
    ElAlert
  },
  props: {
    type: {
      type: String,
      default: 'success'
    }
  },
  setup(props) {
    return {bem};
  }
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>

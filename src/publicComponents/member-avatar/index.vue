<template>
  <img
    v-bind="$attrs"
    class="avatar"
    :class="[size,radius]"
  >
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'MemberAvatar',
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: 'normal'
    },
    radius: {
      type: String,
      default: 'circle'
    }
  },
  setup() {

  }
});
</script>
<style lang="less" scoped>
  .avatar {
    display: block;
    width: 40px;
    height: 40px;
  }

  .rather-small {
    width: 24px;
    height: 24px;
  }

  .small-side {
    width: 30px;
    height: 30px;
  }

  .normal {
    width: 40px;
    height: 40px;
  }

  .large {
    width: 47px;
    height: 47px;
  }

  .rather-large {
    width: 60px;
    height: 60px;
  }

  .circle {
    border-radius: 50%;
  }

  .square {
    border-radius: 0;
  }
</style>

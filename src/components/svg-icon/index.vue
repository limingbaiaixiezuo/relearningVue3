<template>
  <svg
    aria-hidden="true"
    class="icon"
  >
    <use
      :href="symbolId"
    />
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const symbolId = computed(() => `#icon-${props.name}`);
    return { symbolId };
  }
});
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentcolor;
}
</style>

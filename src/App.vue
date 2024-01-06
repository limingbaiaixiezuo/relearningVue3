<template>
  <RouterView />
</template>

<script>

import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
  props: {},
  setup(props) {
    return {};
  }
});

</script>

<style lang="less">
html,
body,
#app {
  width: 100%;
  height: 100%;
}

body {
  overflow: hidden;
  overscroll-behavior: contain;
  font-family: lato, pingfangsc-regular, 'Microsoft YaHei', sans-serif, 'San Francisco';
  // background-color: var(--o-white);
  background-color: rgb(202, 240, 240);
}

input {
  font-family: lato, pingfangsc-regular, 'Microsoft YaHei', 'San Francisco', sans-serif;
}
</style>

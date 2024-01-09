

<template>
  <div class="hello">
    hello vue3
      <!-- <OBreadcrumbItem to="/">首页</OBreadcrumbItem>
      <OBreadcrumbItem to="/about">关于</OBreadcrumbItem>
      <OBreadcrumbItem to="/home">主页</OBreadcrumbItem> -->
      <!-- <OBreadcrumb
        items={items.value}
        onJump={handleClick}
        separator="/"
      /> -->
      <ElButton type="primary">按钮</ElButton>
  </div>
</template>
<script setup lang="ts">
import { OBreadcrumb } from '@/components';
import { ref } from 'vue';
  const items = ref([
    {
      label: '首页',
      path: '/'
    },
    {
      label: '关于',
      path: '/about'
    },
    {
      label: '主页',
      path: '/home'
    }
  ])
  const handleClick = (item: any) => {
    console.log(item)
  }
</script>
<style lang="less" scoped>
.hello {
  color: red;
  font-size: large;
}
</style>
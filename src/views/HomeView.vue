

<template>
  <!-- <div class="hello"> -->
    <!-- hello vue3 -->
      <!-- <OBreadcrumbItem to="/">首页</OBreadcrumbItem>
      <OBreadcrumbItem to="/about">关于</OBreadcrumbItem>
      <OBreadcrumbItem to="/home">主页</OBreadcrumbItem> -->
      <!-- <OBreadcrumb
        items={items.value}
        onJump={handleClick}
        separator="/"
      /> -->
      <!-- <ElButton type="primary">按钮</ElButton> -->
  <!-- </div> -->
  <div class="layout">
    <grid-layout
        v-model:layout="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
    >

        <grid-item v-for="item in layout"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :key="item.i">
            <div
              class="hello"
              @click="handleClick(item.i)"
            >{{item.i}}</div>
        </grid-item>
    </grid-layout>
  </div>
  
</template>
<script setup lang="ts">
// import { OBreadcrumb } from '@/components';
// import { GridLayout, GridItem } from 'vue-grid-layout';
  // import { GridItem, GridLayout } from 'vue-ts-responsive-grid-layout';
import { ref, watch } from 'vue';
// import { GridLayout, GridItem } from 'vue-grid-layout';
import { GridLayout, GridItem } from  'vue3-grid-layout-next'
import { useRouter } from 'vue-router'
const router = useRouter()
  const layout = ref([
                {"x":0,"y":0,"w":2,"h":2,"i":"CSS"},
                {"x":2,"y":0,"w":2,"h":4,"i":"JS"},
                {"x":4,"y":0,"w":2,"h":5,"i":"TS"},
                {"x":6,"y":0,"w":2,"h":3,"i":"VITE"},
                {"x":8,"y":0,"w":2,"h":3,"i":"WEBPACK"},
                {"x":10,"y":0,"w":2,"h":3,"i":"VUE3"},
                {"x":0,"y":5,"w":2,"h":5,"i":"REACT"},
                {"x":2,"y":5,"w":2,"h":5,"i":"PINIA"},
                {"x":4,"y":5,"w":2,"h":5,"i":"PYHTHON"},
                {"x":6,"y":3,"w":2,"h":4,"i":"Visualizer"},
                {"x":8,"y":4,"w":2,"h":4,"i":"10"},
                {"x":10,"y":4,"w":2,"h":4,"i":"11"},
                {"x":0,"y":10,"w":2,"h":5,"i":"12"},
                {"x":2,"y":10,"w":2,"h":5,"i":"13"},
                {"x":4,"y":8,"w":2,"h":4,"i":"14"},
                {"x":6,"y":8,"w":2,"h":4,"i":"15"},
                {"x":8,"y":10,"w":2,"h":5,"i":"16"},
                {"x":10,"y":4,"w":2,"h":2,"i":"17"},
                {"x":0,"y":9,"w":2,"h":3,"i":"18"},
                {"x":2,"y":6,"w":2,"h":2,"i":"19"}
            ])

  watch(() => layout.value, (newVal, oldVal) => {
      console.log('layout changed', newVal, oldVal)
  })
  
  const handleClick = (i: string) => {
    console.log(i)
    if(i === 'Visualizer') {
      router.push('/Visualizer')
    }
  }
</script>
<style lang="less" scoped>

:deep(.vue-grid-item.vue-grid-placeholder) {
    background: rgb(220, 194, 25) !important;
}

.layout {
  width: 100%;
  height: 100%;
  background-color: rgb(91, 22, 211);
}
.hello {
  color: red;
  font-size: large;
  background-color: aqua;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
}
</style>
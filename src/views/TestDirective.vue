<template>
    <div class="app" style="border:1px solid #ddd;margin:4px">
      <!-- <DefaultImp></DefaultImp> -->
      <!-- <CustomLocalDirective></CustomLocalDirective> -->
      <!-- <DirectiveLifeCycle></DirectiveLifeCycle> -->
      <!-- <DirectiveParamAndModifier></DirectiveParamAndModifier> -->
      <h4 v-format-time="'YYYY/MM/DD'" :style="{color:'red'}" :data-timestamp="timestamp">{{timestamp}}</h4>
      <h4  :style="{color:'red'}">{{timestamp}}</h4>
      <div style="border:1px solid #ddd;margin:8px">
      <ElInput v-focus v-model="timestamp"/>
  </div>
    </div>
  </template>
  
  <script setup>
//   import { watch } from 'vue';
import { ref } from 'vue';
  let timestamp = ref(1645710167);
//   watch(timestamp, (val) => {
//     console.log(val);
//   });
    // const timestamp = 1645710167;
  </script>
<template>
  <ElPopover
    v-model:visible="visible"
    placement="bottom-end"
    trigger="click"
    :width="(196/144) +'rem'"
    v-bind="$attrs"
  >
    <template #reference>
      <div
        class="switch-color-btn"
        :style="colorDropStyle"
      >
        <SvgIcon
          name="status-color"
          class="color-icon"
        />
      </div>
    </template>
    <div class="color-container">
      <div
        v-for=" (item, index) in colorArray"
        :key="index"
        class="color-item"
        :style="`background-color:${item};`"
        @click="updateColor(index)"
      />
      <div v-if="!colorArray.length">
        {{ $t('noData') }}
      </div>
    </div>
  </ElPopover>
</template>
<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'ColorDrop',
  props: {
    color: {
      type: String,
      default: ''
    },
    clickVisible: {
      type: Boolean,
      default: false
    },
    colorArray: {
      type: Array,
      require: true,
      default: () => []
    },
    colorDropStyle: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['setColor'],
  setup(props, {emit}) {
    const visible = ref(false);
    const updateColor = (colorIndex) => {
      if (props.clickVisible) visible.value = false;
      emit('setColor', colorIndex);
    };

    return { updateColor, visible};
  }
});
</script>
<style lang="scss" scoped>
  .color-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    padding: 10px 0;
    width: 170px;
  }
 .color-item{
    width: 20px;
    height: 20px;
    margin: 4px;
    border-radius: 50%;
    cursor: pointer;
    border:  1px solid #dee0e3;
 }
 .switch-color-btn {
    position: relative;
    font-size: 16px;
    color:var(--o-white);
    width:30px;
    height:30px;
    flex-shrink: 0;
    border-top: 1px solid;
    border-left: 1px solid;
    border-bottom: 1px solid;
    border-top-left-radius: 6px ;
    border-bottom-left-radius: 6px;
    background-color: v-bind('color');
    border:  1px solid #dee0e3;

    cursor: pointer;
    .color-icon{
      opacity: 0;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
    &:hover{
      .color-icon{
        opacity: 1;
      }
    }
  }
</style>

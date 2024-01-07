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
<style lang="less" scoped>
.item {
  overflow: hidden;
  display: flex;
  align-items: center;
  // width: 200px;
  width: 100%;
  height: 40px;

  &:hover {
    .delete-icon {
      opacity: 1;
    }
  }
  .item-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 34px;
    border: 1px solid;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: #999eb5 0 0 1px;

    .content-text {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 34px;
      font-size: 13px;
      line-height: 25px;
      padding-left: 10px;
      background-color: var(--o-white);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.delete-icon {
  margin-left: 6px;
  opacity: 0;
  font-size: 18px;
  line-height: 40px;
  cursor: pointer;
  &:hover {
    color: #ea4c89 !important;
  }
}
.el-input__wrapper {
  box-sizing: border-box;
  height: 25px;
  background-color: transparent;
  border: none !important;
  box-shadow: none !important;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  font-size: 12px;
  &:hover {
    border: none;
    box-shadow: none;
  }
  &:focus {
    border: none;
    box-shadow: none;
  }
}
.item-content {
  flex: 1;
  overflow: hidden;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.edit-input {
  border: 1px solid transparent;
  border-left: none;
}
.hoverInput {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  width: 100% !important;
  height: 100% !important;
  &:hover {
    border-color: #ea4c89;
  }
  &:focus {
    border-color: #ea4c89;
  }
}
.containerHover {
  &:hover {
    border-color: #ea4c89 !important;
  }
}
.hideIcon {
  visibility: hidden;
}
.switch-color-btn {
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}
.add-item {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 40px;
  line-height: 40px;
  color: #999eb5;
  cursor: pointer;
  background-color: var(--o-white);

  &:hover {
    color: var(--opink);
  }

  &::before {
    position: absolute;
    top: -20px;
    display: block;
    width: 100%;
    height: 20px;
    content: '';
    background-color: var(--o-white);
  }
}

</style>

<template>
  <div class="item">
    <div
      ref="containerBox"
      class="item-container"
      :style="{'border-color':borderColor}"
    >
      <ColorDrop
        v-if="modifyMode"
        :color="tagColor"
        :color-array="colorList"
        click-visible
        :color-drop-style="{width: '34px',height: '100%'}"
        @set-color="setColor"
      />
      <div
        v-if="!modifyMode"
        class="switch-color-btn"
        :style="{backgroundColor:tagColor}"
        @click="checkItem"
      />
      <div
        class="item-content"
        :style="{backgroundColor:contentBg}"
      >
        <div
          v-if="!modifyMode || immutable"
          class="content-text"
          @click="checkItem"
        >
          {{ info.text }}
        </div>
        <ElInput
          v-else
          ref="inputDOM"
          v-model="inputValue"
          class="edit-input"
          :class="{hoverInput:inputHover}"
          @blur="setValue"
          @keyup.enter="(e)=>inputDOM.blur()"
        />
      </div>
    </div>
    <div
      v-if="!immutable"
      class="delete-icon"
      :style="{color:tagColor }"
      :class="{hideIcon:!modifyMode}"
      @click="deleteItem"
    >
      <SvgIcon name="close-circle" />
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick} from 'vue';
import {colorArray} from '@/constant';
import ColorDrop from './ColorDrop.vue';

export default defineComponent({
  components: { ColorDrop },
  props: {
    // 传入此参数会在item容器外部加边框
    borderColor: {
      type: String,
      default: 'transparent'
    },
    containerHover: {
      type: Boolean,
      default: true
    },
    // 当前模式
    modifyMode: {
      type: Boolean,
      default: true
    },
    // 颜色数组
    colorList: {
      type: Array,
      default: () => colorArray
    },
    // 当前项信息
    info: {
      type: Object,
      default: () => ({})
    },
    // 输入框背景
    contentBg: {
      type: String,
      default: 'transparent'
    },
    // hover效果
    inputHover: {
      type: Boolean,
      default: false
    },
    immutable: {// 是否可以更改
      type: Boolean,
      default: false
    },
    isStatusMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['setColor', 'setValue', 'deleteItem', 'selectItem', 'addTag'],
  setup(props, {emit, expose}) {
    const containerBox = ref(null);
    // 修改值
    const inputDOM = ref(null);

    const inputValue = ref(props.info.text);

    const tagColor = computed(() => props.colorList[props.info.color]);
    // 颜色修改
    const setColor = (colorIndex) => {
      emit('setColor', props.info, colorIndex);
    };

    const setValue = () => {
      emit('setValue', props.info, inputValue.value);
      if (props.isStatusMode) return;
      nextTick(() => {
        inputValue.value !== props.info.text && (inputValue.value = props.info.text);
      });
    };

    // 删除
    const deleteItem = () => {
      emit('deleteItem', props.info.id);
    };

    const createContainerHover = () => {
      containerBox.value.onmouseenter = (e) => {
        e.target.style.borderColor = tagColor.value;
      };
      containerBox.value.onmouseleave = (e) => {
        e.target.style.borderColor = props.borderColor;
      };
    };

    const unContainerHover = () => {
      containerBox.value.onmouseenter = null;
      containerBox.value.onmouseleave = null;
    };

    onMounted(() => {
      props.containerHover && createContainerHover();
    });

    onBeforeUnmount(() => {
      props.containerHover && unContainerHover();
    });

    const checkItem = () => {
      emit('selectItem', props.info);
    };

    const focus = () => {
      inputDOM.value.focus();
    };

    expose({
      focus,
      value: inputValue.value
    });

    return {
      inputValue,
      inputDOM,
      setColor,
      setValue,
      deleteItem,
      checkItem,
      tagColor,
      containerBox,
      colorArray
    };
  }
});
</script>

<style lang="scss" scoped>
.item{
  overflow: hidden;
  display:flex;
  align-items: center;
  // width: 200px;
  width: 100%;
  height:40px;

  &:hover{
    .delete-icon{
      opacity: 1;
    }
  }
  .item-container{
    flex:1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    height:34PX;
    border: 1px solid;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: #999eb5 0  0 1PX;

    .content-text {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 34PX;
      font-size:13px;
      line-height:25PX;
      padding-left: 10px;
      background-color: var(--o-white);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.delete-icon{
  margin-left: 6px;
  opacity: 0;
  font-size: 18px;
  line-height: 40px;
  cursor: pointer;
  &:hover{
    color:#ea4c89 !important;;
  }
}
:deep(.el-input__wrapper){
  box-sizing: border-box;
  height:25px;
  background-color: transparent;
  border: none !important;
  box-shadow: none !important;
  border-top-right-radius:6px;
  border-bottom-right-radius:6px;
  font-size:12px;
  &:hover{
    border: none;
    box-shadow: none;
  }
  &:focus{
    border: none;
    box-shadow: none;
  }
}
.item-content{
  flex: 1;
  overflow: hidden;
  border-top-right-radius:6px;
  border-bottom-right-radius:6px;
}
.edit-input{
  border: 1px solid transparent;
  border-left: none;
}
.hoverInput{
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  width: 100% !important;
  height: 100% !important;
  &:hover{
    border-color:  #ea4c89;
  }
  &:focus{
    border-color:#ea4c89;
  }
}
.containerHover{
  &:hover{
    border-color: #ea4c89 !important;
  }
}
.hideIcon{
  Visibility:hidden;
}
.switch-color-btn{
  width:25px;
  height:25px;
  flex-shrink: 0;
  border-top-left-radius: 6px ;
  border-bottom-left-radius: 6px ;
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
    color: var(--o-pink);
  }

  &::before {
    position: absolute;
    top: -20px;
    display: block;
    width: 100%;
    height: 20px;
    content: '';
    background-color:var(--o-white);
  }
}
</style>

<template>
  <ElPopover
    v-bind="$attrs"
    placement="left"
    width="230px"
  >
    <div class="tip-content">
      <div
        v-for="item in testTextArr"
        :key="item.name"
        class="tip-item"
      >
        <ElCheckbox
          validate-event
          :model-value="item.flag"
          disabled
        />
        {{ item.text }}
      </div>
    </div>
    <template #reference>
      <slot />
    </template>
  </ElPopover>
</template>

<script>
import { defineComponent, computed } from 'vue';
import {useI18n} from 'vue-i18n';
export default defineComponent({
  name: 'TestPop',
  props: {
    info: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const {t} = useI18n();
    const testTextArr = computed(() => props.info.map(item => {
      let text = '';
      switch (item.name) {
        case 'lengthReg':
          text = t('atLeast', {key: '8', msg: t('characters')});
          break;
        case 'numberReg':
          text = t('atLeast', {key: '1', msg: t('number')});
          break;
        case 'majusculeReg':
          text = t('atLeast', {key: '1', msg: t('uppercaseLetter')});
          break;
      }
      return {...item, text};
    }));
    return {testTextArr};
  }
});
</script>
<style lang="less" scoped>
  .tip-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    .tip-item {
      display: flex;
      align-items: center;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      color: var(--gray-22);
    }
  }

  :deep(.el-checkbox__input) {
    margin-right: 5px;

    .is-checked {
      background-color: #4466d1 !important;
      border-color: #4466d1 !important;
    }
  }

  :deep(.el-popper) {
    width: auto;
  }

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    background-color: #4466d1 !important;
    border: 1px solid #4466d1 !important;
  }

  :deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
    border-color: white;
  }
</style>

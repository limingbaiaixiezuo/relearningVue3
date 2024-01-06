<template>
  <div class="protective">
    {{ $t('googleProtect') }}
    <span class="underline" @click="drawer=true">{{ $t('privacyPolicy') }}</span>
    {{ $t('probationaryTerms') }}
  </div>
  <div class="drawer-box">
    <ElDrawer
      v-model="drawer" direction="btt"
      size="100%"
    >
      <template #header>
        <div class="header">
          <SvgIcon name="openpologo" class="header-svg" />
          <div class="product">
            产品许可及服务协议
          </div>
        </div>
      </template>
      <Info />
    </ElDrawer>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
import Info from './info.vue';
export default defineComponent({
  name: 'ProtectiveFooter',
  components: {
    Info
  },
  setup() {
    const drawer = ref(false);

    return {
      drawer
    };
  }

});
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: normal;
  height: 60px;
  padding: 0;

  .header-svg {
    position: relative;
    top: -60px;
    margin-right: 10px;
    font-size: 170px;
  }

  .product {
    position: relative;
    top: 35px;
    left: -125px;
    font-size: 10px;
    color: #00174c;
  }
}

.protective {
  width: 100%;
  padding: 0 10px;
  margin-top: -30px;
  font-size: 12px;
  color: #9b9faf;

  .underline {
    text-decoration: underline;
    cursor: pointer;
  }
}

p {
  margin-bottom: 10px;
}

.drawer-box :deep(.el-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    color: #00174c;
  }
}

</style>

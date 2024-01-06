<template>
  <ODialog
    v-bind="$attrs"
    width="500px"
    :show-confirm-button="false"
    :footer="null"
  >
    <div class="invite-container">
      <div class="invite-content">
        <div
          class="logo"
          v-text="'logo'"
        />
        <div
          class="invite-bg"
          v-text="'背景图片'"
        />
      </div>
      <div class="invite-footer">
        <div class="footer-member">
          <div class="footer-avatar" />
          <div class="footer-name">
            {{ info.inviter }}
          </div>
        </div>
        <div class="footer-info">
          {{ $t('inviteJoin', {thing: $t('workspace'), thingName:info.spaceName}) }}
        </div>
        <div class="footer-btn">
          <ElButton @click="acceptWorkSpace">
            {{ $t('accept') }}
          </ElButton>
        </div>
      </div>
    </div>
  </ODialog>
</template>

<script>
import { defineComponent } from 'vue';
import {joinWorkSpace} from '@/api';
import {ODialog} from '@/components/dialog';
export default defineComponent({
  name: 'InvitationDialog',
  components: {ODialog},
  inheritAttrs: false,
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const acceptWorkSpace = async() => {
      const params = {
        code: props.info.code
      };
      const res = await joinWorkSpace(params);
      if (res.code === 200) {
        emit('update:modelValue', false);
      }
    };
    return {acceptWorkSpace};
  }
});
</script>
<style lang="less" scoped>
:deep(.ant-modal-body) {
  // TODO color
  background-color: pink !important;
}

.invite-container {
  .invite-content {
    position: relative;
    height: 250px;

    .logo {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
      // TODO color
      background-color: pink;
    }

    .invite-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 200px;
      line-height: 200px;
      text-align: center;
      // TODO color
      background-color: pink;
      transform: translate(-50%, -50%);
    }
  }

  .invite-footer {
    display: flex;
    align-items: center;
    height: 80px;
    padding: 20px;
    // TODO-color
    background-color: skyblue;

    .footer-member {
      display: flex;
      flex: 1;
      align-items: center;
      // TODO color
      border-right: 1px solid #ccc;

      .footer-avatar {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        background-color: pink;
        border-radius: 50%;
      }

      .footer-name {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .footer-info {
      width: 200px;
      padding: 0 10px;
    }

    .footer-btn {
      display: flex;
      flex: 1;
      justify-content: flex-end;
    }
  }
}
</style>


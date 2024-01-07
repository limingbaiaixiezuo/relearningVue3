<template>
  <div
    :class="getStyle(sign)"
  >
    <slot />
  </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TextView',
  components: {},
  props: {
    text: {
      type: String,
      default: ''
    },
    sign: {
      type: String,
      default: ''
    },
    settings: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [''],
  setup(props, { emit, expose }) {
    const styles = {
      'email-h1': 'h1-style',
      'email-h2': 'h2-style',
      'personalize-h1': 'personalize-h1',
      'personalize-h2': 'personalize-h2',
      'import-list-h1': 'import-list-h1',
      'import-list-h2': 'import-list-h2',
      'import-list-h3': 'import-list-h3',
      'trial-h1': 'trial-h1',
      'trial-h2': 'trial-h2',
      'trial-h3': 'trial-h3',
      'sheet-name': 'sheet-name'
    };

    const getStyle = (val) => {
      return styles[val];
    };

    return {
      getStyle
    };
  }
});
</script>

<style lang="less" scoped>
    .h1-style {
      width: 246px;
      margin: 15px 15px 15px 0;
      font-size: 28px;
      font-weight: normal;
      // TODO color
      color: #333;
      text-align: left;
      border-radius: 0;
    }

    .h2-style {
      width: 408px;
      height: 20px;
      font-size: 14px;
      font-weight: normal;
      // TODO color
      color: #424656;
      text-align: left;
      border-radius: 0;
    }

    .personalize-h1 {
      width: 380px;
      height: 60px;
      font-size: 22px;
      font-weight: normal;
      line-height: 30px;
      color: #424656;
      text-align: left;
    }

    .personalize-h2 {
      width: 380px;
      height: 28px;
      margin-top: 10px;
      font-size: 10px;
      font-weight: normal;
      line-height: 18px;
      color: #424656;
      text-align: left;
    }

    .import-list-h1 {
      width: 380px;
      height: 40px;
      font-size: 28px;
      font-weight: normal;
      line-height: 40px;
      color: #424656;
      text-align: left;
    }

    .import-list-h2 {
      width: 380px;
      font-size: 14px;
      font-weight: normal;
      line-height: 42px;
      color: #424656;
      text-align: left;
    }

    .import-list-h3 {
      width: 380px;
      font-size: 14px;
      font-weight: normal;
      line-height: 32px;
      color: #92a4eb;
      text-align: left;
    }

    .import-list-h3:hover {
      opacity: 0.75;
    }

    .trial-h1 {
      width: 380px;
      height: 44px;
      padding: 0 4px;
      font-size: 22px;
      font-weight: normal;
      color: #424656;
      text-align: left;
    }

    .trial-h2 {
      width: 380px;
      height: 44px;
      padding: 0 5px;
      margin-top: 10px;
      font-size: 14px;
      font-weight: normal;
      color: #424656;
      text-align: left;
    }

    .trial-h3 {
      width: 380px;
      height: 44px;
      padding: 0 5px;
      margin-top: 5px;
      font-size: 14px;
      font-weight: normal;
      color: #424656;
      text-align: left;
    }

    .sheet-name {
      width: 111px;
      height: 28px;
      margin-bottom: 15px;
      font-size: 20px;
      font-weight: normal;
      color: #00174c;
      text-align: left;
      border-radius: 0;
    }
</style>

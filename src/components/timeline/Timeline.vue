<template>
  <div class="block">
    <div class="radio">
      排序：
      <ElRadioGroup v-model="reverse">
        <ElRadio :label="true">
          倒序
        </ElRadio>
        <ElRadio :label="false">
          正序
        </ElRadio>
      </ElRadioGroup>
    </div>

    <ElTimeline :reverse="reverse">
      <ElTimelineItem
        v-for="(activity,index) in activities"
        :key="index"
        v-bind="$attrs"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
      </ElTimelineItem>
    </ElTimeline>
  </div>
</template>

<script>
import {defineComponent, reactive, ref} from 'vue';
import {createNamespace} from '@/utils';
// import more from '../../icons/const/more';
import {ElTimeline, ElTimelineItem, ElRadioGroup, ElRadio} from 'element-plus';
const [name, bem] = createNamespace('timeline');
export default defineComponent({
  name,
  components: {
    ElTimeline,
    ElTimelineItem,
    ElRadioGroup,
    ElRadio
  },
  setup(props) {
    const reverse = ref(true);
    const activities = reactive([{
      content: '活动按期开始',
      timestamp: '2018-04-15',
      size: 'large',
      type: 'primary',
      color: '#D0D4E4'
    }, {
      content: '通过审核',
      timestamp: '2018-04-13',
      color: '#D0D4E4',
      size: 'large',
      type: 'primary'
    }, {
      content: '创建成功',
      timestamp: '2018-04-11',
      color: null,
      size: 'large',
      type: 'primary'
    }]);
    return {
      reverse,
      activities,
      bem
    };
  }
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>


import { DETAIL_WEEKS, MAX_LEVEL, MONTH_KEY } from '../constants';
import { formatDayValue } from '../utils';
import { makeArrayProp, makeNumberProp, makeObjectProp } from '@/utils';
import { defineComponent, inject, ref } from 'vue';
import { SvgIcon } from '@/components';
import { ElPopover } from 'element-plus';
import Task from './Task';

const props = {
  mIndex: makeNumberProp(),
  curDay: makeObjectProp({day: '', month: ''}),
  moreTasks: makeArrayProp(),
  takeLevelLen: makeNumberProp()
};

export default defineComponent({
  name: 'MoreTask',
  props,
  setup(props) {
    const context = inject(MONTH_KEY);
    const visible = ref(false);
    const setVisible = (visibleStatus) => {
      visible.value = visibleStatus;
    };

    const renderTitle = () => {
      const { mIndex, curDay } = props;
      const { lang } = context;

      return (
        <h6>
          {formatDayValue(curDay.month, curDay.day, lang)}
          <MoreHeader>
            {DETAIL_WEEKS[lang][mIndex]}
          </MoreHeader>
        </h6>
      );
    };

    const renderMoreList = () => {
      const { moreTasks } = props;
      const { listHeight, isMobile } = context;
      const tasksLength = moreTasks.length;
      const itemHeight = listHeight + 22 + (isMobile ? 8 : 4);
      return (
        <div isMobile={isMobile}>
          <div
            height={Math.min(500, tasksLength * itemHeight)}
            width='100%'
            className='moreList'
          >

            {
              moreTasks.map((task, index) => {
                return (
                  <div>
                    <Task key={index} levelItem={task} isMore />
                  </div>
                );
              })
            }

          </div>
        </div>
      );
    };

    const renderContent = () => {
      return (
        <div>
          <header>
            {renderTitle()}
            <SvgIcon icon={'close'} onClick={() => setVisible(false)} />
          </header>
          {renderMoreList()}
        </div>
      );
    };

    const renderButton = () => {
      const { mIndex, takeLevelLen } = props;
      const { listHeight, defaultListHeight, space, moreText } = context;
      return (
        <div
          underline={false}
          class='more-task'
          style={{
            position: 'absolute',
            zIndex: 1,
            top: Math.min(MAX_LEVEL, takeLevelLen) * (listHeight.value + space) + defaultListHeight + 4 + 'px',
            left: mIndex * (100 / 7) + '%',
            width: (100 / 7) + '%'
          }}
        >
          {moreText}
        </div>
      );
    };
    const slots = {
      default: renderContent,
      reference: renderButton

    };

    return () => {
      const { mIndex } = props;
      return (
        <ElPopover
          key={mIndex}
          v-slots={slots}
          trigger={'click'}
          overlayClassName='taskModal'
          destroyTooltipOnHide
          overlayStyle={{
            zIndex: 15,
            padding: 0
          }}
          onVisibleChange={(visibleStatus) => {
            visible.value = visibleStatus;
          }}
        >

        </ElPopover>
      );
    };
  }
});



import { Direction, MONTH_KEY } from '../constants';
import { get } from 'lodash';
import { defineComponent, inject } from 'vue';
import { createNamespace, makeBooleanProp, makeNumberProp, makeObjectProp } from '@/utils';

const props = {
  levelItem: makeObjectProp(),
  levelIdx: makeNumberProp(),
  isMore: makeBooleanProp()
};

const [name, bem] = createNamespace('task', true);

export default defineComponent({
  name,
  props,
  setup(props) {
    const context = inject(MONTH_KEY);

    const renderLeftResize = (id, disableResize, isEmptyEnd, startDisabled, isStart) => {
      const show = !disableResize.value && !isEmptyEnd && !startDisabled && isStart;
      return (
        show && (
          <div
            className='left-resize'
            onMousedown={(e) => {
              context.onResizeStart(e, id, Direction.Left);
              e.preventDefault();
            }}
          />
        )
      );
    };

    const renderRightResize = (id, disableResize, endDisabled, isEnd) => {
      const show = !disableResize.value && !endDisabled && isEnd;
      return (
        show && (
          <div
            className='right-resize'
            onMousedown={(e) => {
              context.onResizeStart(e, id, Direction.Right);
              e.preventDefault();
            }}
          />
        )
      );
    };

    const renderDrag = (task) => {
      const { Drag, listStyle, startListStyle, isMore, disabled } = context;
      const { isStart } = props.levelItem;

      return (
        Drag ? (
          <Drag
            id={task.id}
            listStyle={{
              ...listStyle,
              ...(isStart ? startListStyle : {}),
              height: parseInt(get(listStyle, 'height', '0')) + (isMore ? 22 : 0) + 'px'
            }}
            task={task}
            disabled={disabled}
            isMore={isMore}
          >
            {task.title}
          </Drag>
        ) : <div className='list' style={{
          ...listStyle,
          ...(isStart ? startListStyle : {})
        }}>
          {task.title}
        </div>
      );
    };

    return () => {
      const { moveTaskId, disabled, listHeight, space, defaultListHeight, warnText, disableResize } = context;
      const { levelItem, levelIdx } = props;
      const { task, isEnd, isStart, isEmptyEnd, left, len, warn } = levelItem;
      const {id, startDisabled, endDisabled} = task;
      const style = levelIdx !== undefined ? {
        top: levelIdx * (listHeight.value + space) + defaultListHeight + 4 + 'px',
        left: (left - 1) * (100 / 7) + '%',
        width: (len || 1) * (100 / 7) + '%'
      } : {
        position: 'relative'
      };

      return (
        <div
          key={id}
          className={bem({
            endClose: !(isEnd || isEmptyEnd),
            startClose: !isStart,
            draggable: disabled,
            isMove: moveTaskId === id
          })}
          style={style}
        >
          {renderLeftResize(id, disableResize, isEmptyEnd, startDisabled, isStart)}
          {renderRightResize(id, disableResize, endDisabled, isEnd)}
          {renderDrag(task)}
          {warn && warnText}
        </div>
      );
    };
  }
});

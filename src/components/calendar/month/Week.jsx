
import dayjs from 'dayjs';
import { computed, defineComponent, inject } from 'vue';
import { take } from 'lodash';
import { formatDayValue } from '../utils';
import { FORMAT, MAX_LEVEL, MONTH_KEY } from '../constants';
import { createNamespace, makeArrayProp, makeNumberProp, makeObjectProp } from '@/utils';
import MoreTask from './MoreTask';
import Task from './Task';

const props = {
  year: makeNumberProp(),
  month: makeNumberProp(),
  week: makeObjectProp({day: '', month: ''}),
  weekLevel: makeNumberProp(),
  levelTasks: makeArrayProp(),
  rowHeight: makeNumberProp()
};

const [name] = createNamespace('week', true);
const [, dayBem] = createNamespace('day', true);

export default defineComponent({
  name,
  props,
  setup(props) {
    const context = inject(MONTH_KEY);
    const takeLevels = computed(() => take(props.levelTasks, MAX_LEVEL));

    const moreData = computed(() => {
      const more = new Array(7).fill(0);
      const moreTasks = new Array(7).fill([]);
      props.levelTasks.forEach(level => {
        level.forEach(levelItem => {
          const { left, len } = levelItem;
          for (let i = 0; i < len; i++) {
            const mIdx = left + i - 1;
            more[mIdx]++;
            moreTasks[mIdx] = moreTasks[mIdx].concat(levelItem);
          }
        });
      });
      return { more, moreTasks };
    });

    const renderRows = () => {
      const { week, month, year } = props;
      const { lang, today, update, disabled, Drop } = context;
      return (
        <div className='row-bg'>
          {week.map((weekItem, idx) => {
            const { day, month: m } = weekItem;
            const currDay = dayjs(`${year}-${m}-${day}`);
            const isToday = today === currDay.format(FORMAT);
            let dayValue = day;
            if (day === 1 && !isToday) {
              const showMonth = m > 12 ? m % 12 : m;
              dayValue = formatDayValue(showMonth, day, lang);
            }

            const dayContent = (
              <span className='day-value'>
                {dayValue}
              </span>
            );

            return (
              <div
                key={`${m}-${day}`}
                className={
                  dayBem({
                    weekend: [0, 6].includes((idx + 1) % 7),
                    curMonth: m === month,
                    today: isToday
                  })

                }
              >
                {Drop ? <Drop children={dayContent} date={currDay} update={update} disabled={disabled} /> : dayContent}
              </div>
            );
          })}
        </div>
      );
    };

    const renderTask = () => {
      return takeLevels.value.map((level, levelIdx) => {
        return (
          <div className='level-row' key={levelIdx}>
            {level.map((levelItem, levelItemIdx) => (
              <Task key={levelItemIdx} levelItem={levelItem} levelIdx={levelIdx} />
            ))}
          </div>
        );
      });
    };

    const renderMoreTask = () => {
      const { more, moreTasks } = moreData.value;
      const { week } = props;

      return (
        more.map((m, mIndex) => {
          if (m <= MAX_LEVEL) {
            return null;
          }
          const curDay = week[mIndex];
          return (
            <MoreTask
              key={mIndex}
              mIndex={mIndex}
              curDay={curDay}
              moreTasks={moreTasks[mIndex]}
              takeLevelLen={takeLevels.value.length}
            />
          );
        })
      );
    };

    return () => {
      const { weekLevel, rowHeight } = props;

      return (
        <div className='week-row' key={weekLevel} style={{ height: rowHeight + 'px' }}>
          {renderRows()}
          {renderTask()}
          {renderMoreTask()}
        </div>
      );
    };
  }
});


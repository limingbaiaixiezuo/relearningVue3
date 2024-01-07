import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { COUNT, Direction, FORMAT_MONTH, MONTHS } from './constants';
dayjs.extend(minMax);

const date2Day = (date) => {
  if (!dayjs(date).isValid()) {
    return dayjs();
  }
  return dayjs(date);
};

export const date2Month = (date) => {
  const formatDate = dayjs(date).format(FORMAT_MONTH) + '/01';
  return dayjs(formatDate);
};

export const resizeFormat = (resizeData) => {
  let { startDate, endDate } = resizeData;
  endDate = endDate || startDate;
  startDate = startDate || endDate;
  const { day, direction } = resizeData;
  const isRight = direction === Direction.Right;
  const isWarning = dayjs(startDate).isAfter(endDate);
  if (isRight) {
    endDate = isWarning ? dayjs(startDate) : dayjs(endDate).add(day, 'day');
    if (dayjs(startDate).isAfter(endDate)) {
      endDate = startDate;
    }
  } else {
    const calcStartDate = dayjs(startDate).subtract(day, 'day');
    if (!isWarning && dayjs(calcStartDate).isAfter(endDate)) {
      startDate = endDate;
    } else if (!(isWarning && dayjs(calcStartDate).isAfter(startDate))) {
      startDate = calcStartDate;
    }
  }
  return { startDate, endDate };
};

export const daysInMonth = (year, month) => {
  const d = new Date(year, month - 1, 0);
  return d.getDate();
};

export const firstDayOfMonth = (year, month) => {
  const d = new Date(year, month - 1, 1);
  const day = d.getDay();
  return day === 0 ? 7 : day;
};

export const formatDate = (year, month, lang) => {
  return lang === 'zh' ? `${year}年${month}月` : `${MONTHS[month - 1]} ${year}`;
};

export const getPanelData = (step) => {
  const now = new Date();
  const currMonth = now.getMonth();
  const totalMonth = step + currMonth + 1;
  const year = now.getFullYear() + Math.ceil(totalMonth / 12) - 1;
  let month = totalMonth % 12;
  if (month <= 0) {
    month += 12;
  }
  const days = daysInMonth(year, month + 1);
  const preDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const data = [];
  let i = 1;
  const count = COUNT + (days + firstDay - 1 > COUNT ? 7 : 0);
  while (count >= i) {
    if (firstDay >= i + 1) {
      data.push({
        day: preDays - firstDay + i + 1,
        month: month - 1
      });
    } else if (days < i + 1 - firstDay) {
      data.push({
        day: i + 1 - firstDay - days,
        month: month + 1
      });
    } else {
      data.push({
        day: i + 1 - firstDay,
        month
      });
    }
    i++;
  }
  return {
    data,
    year,
    month
  };
};

export const isMouseEvent = (event) => {
  return Boolean(event.clientX || event.clientX === 0) && Boolean(event.clientY || event.clientY === 0);
};

export const isTouchEvent = (event) => {
  return Boolean(event.touches && event.touches.length);
};

export const getLevels = ({ week, year, tasks, resizeMsg }) => {
  const start = week[0];
  const end = week[week.length - 1];
  const startDate = dayjs(new Date(year, start.month - 1, start.day));
  const endDate = dayjs(new Date(year, end.month - 1, end.day));
  let updateTasks = tasks;
  if (resizeMsg) {
    const { id, day, direction } = resizeMsg;
    updateTasks = tasks.map(task => {
      if (id === task.id) {
        const { startDate, endDate } = task;
        const formatData = resizeFormat({ startDate, endDate, day, direction });
        return {
          ...task,
          ...formatData
        };
      }
      return task;
    });
  }

  const rowTasks = updateTasks.filter(task => {
    return (!dayjs(task.startDate || task.endDate).isAfter(endDate) && !dayjs(startDate).isAfter(task.endDate || task.startDate)) ||
    (dayjs(task.startDate).isAfter(task.endDate) && !dayjs(task.startDate).isBefore(startDate) && !dayjs(endDate).isBefore(task.startDate));
  }

  ).map(task => {
    const isWarning = dayjs(task.startDate).isAfter(task.endDate);
    const taskStartDate = date2Day(task.startDate || task.endDate);
    const taskEndDate = date2Day(task.endDate || task.startDate);
    const currMaxStartDay = dayjs.max([startDate, taskStartDate]);
    const currMinLastDay = dayjs.min([endDate, taskEndDate]);
    const len = isWarning ? 1 : (currMinLastDay.diff(currMaxStartDay, 'day') + 1);
    const diffStart = taskStartDate.diff(startDate, 'day');
    const diffEnd = endDate.diff(taskEndDate, 'day');
    const left = diffStart < 0 ? 0 : diffStart;

    return {
      task,
      len,
      left: left + 1,
      right: left + len,
      isStart: diffStart >= 0 || isWarning,
      isEmptyStart: !task.startDate,
      isEnd: diffEnd >= 0 || isWarning,
      isEmptyEnd: !task.endDate,
      warn: isWarning
    };
  });
  const levels = [];
  let j;
  for (let i = 0; i < rowTasks.length; i++) {
    const task = rowTasks[i];
    for (j = 0; j < levels.length; j++) {
      const isOver = levels[j].some(seg =>
        seg.left <= task.right && seg.right >= task.left
      );
      if (!isOver) {
        break;
      }
    }
    (levels[j] || (levels[j] = [])).push(task);
  }
  return levels;
};

export const formatDayValue = (month, day, lang) => {
  return lang === 'zh' ? `${month}月${day}日` : `${MONTHS[month - 1]} ${day}`;
};

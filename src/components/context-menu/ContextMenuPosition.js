/*
 * @Author: yinmingdi
 * @Date: 2022-03-15 10:44:00
 * @Description:
 *
 */
let openDirection = 'right';

const gtRightBoundary = (x) => x > window.innerWidth;

const gtLeftBoundary = (x) => x < 0;

const gtBottomBoundary = (y) => y > window.innerHeight;

export const resetDirection = () => {
  openDirection = 'right';
};

export const getPosition = (parent, self, topLevel) => {
  const position = openDirection === 'right'
    ? getRightPosition(parent, self, topLevel)
    : getLeftPosition(parent, self, topLevel);

  const bottomBoundary = window.innerHeight;
  if (gtBottomBoundary(position.y + position.height)) {
    position.y = bottomBoundary - position.height;
  }

  return position;
};

function getLeftPosition(parent, self, topLevel) {
  let position;
  const leftSideX = parent.x - self.width;

  if (gtLeftBoundary(leftSideX)) {
    openDirection = 'right';
    position = getRightPosition(parent, self);
  } else {
    position = {
      x: parent.x - self.width,
      y: parent.y,
      width: self.width,
      height: self.height
    };

    if (topLevel) position.x -= 10;
  }
  return position;
}

function getRightPosition(parent, self, topLevel) {
  let position;
  const rightSideX = parent.x + parent.width + self.width;

  if (gtRightBoundary(rightSideX)) {
    openDirection = 'left';
    position = getLeftPosition(parent, self);
  } else {
    position = {
      x: parent.x + parent.width,
      y: parent.y,
      width: self.width,
      height: self.height
    };

    if (topLevel) position.x += 10;
  }

  return position;
}

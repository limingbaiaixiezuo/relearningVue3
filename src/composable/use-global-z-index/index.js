/**
 * The z-index of Popup components.
 *
 **/

let globalZIndex = 2000;

export const useGlobalZIndex = () => ++globalZIndex;

export const setGlobalZIndex = (val) => {
  globalZIndex = val;
};

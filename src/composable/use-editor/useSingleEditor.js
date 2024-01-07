import { isObject } from '@/utils';
import {onMounted, onBeforeUnmount, ref} from 'vue';

const selectionMoveToEnd = (element) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
};

export function useSingleEditor({initialValue = '', editor = null}) {
  let inputValue;
  if (isObject(initialValue)) {
    inputValue = ref(initialValue?.meta?.formula || initialValue.value);
  } else {
    inputValue = ref(initialValue);
  }

  const updateEditor = (value) => {
    inputValue.value = value;
    editor.innerText = inputValue.value;
    selectionMoveToEnd(editor);
  };

  const editorInput = (e) => {
    inputValue.value = e.target.innerText;
  };

  onMounted(() => {
    editor.addEventListener('keyup', editorInput);
    editor.innerText = inputValue.value;
  });

  onBeforeUnmount(() => {
    editor.removeEventListener('keyup', editorInput);
  });

  return {
    inputValue,
    updateEditor
  };
}

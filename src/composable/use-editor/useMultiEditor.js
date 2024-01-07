import {ref, onMounted, onBeforeUnmount, nextTick} from 'vue';

export function useMultiEditor({initalValue = '' }) {
  const modes = {
    SPECIAL: 'special',
    NORMAL: 'normal'
  };
  const currentMode = ref(modes.NORMAL);

  const value = ref(initalValue);
  const normalEditor = ref();
  const specialEditor = ref();
  const specialEditorInput = ref();

  const isFormula = (val) => /^=/.test(val);

  const selectionMoveToEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  };

  const normalInputHandler = (e) => {
    value.value = normalEditor.value.innerText;
    if (!isFormula(value.value)) {
      enableSpecialEditor();
    }
  };

  const enableNormalEditor = () => {
    currentMode.value = modes.NORMAL;
    specialEditor.value.style.display = 'none';
    normalEditor.value.style.display = 'table-cell';
    normalEditor.value.innerText = value.value;
    selectionMoveToEnd(normalEditor.value);
  };

  const enableSpecialEditor = () => {
    currentMode.value = modes.SPECIAL;
    normalEditor.value.style.display = 'none';
    specialEditor.value.style.display = 'block';
    specialEditorInput.value.focus();
  };

  const specialInputHandler = (e) => {
    value.value = e.target.value;
    if (isFormula(value.value)) {
      enableNormalEditor();
    }
  };

  const initEditor = () => {
    if (isFormula(value.value)) {
      enableNormalEditor();
    } else {
      enableSpecialEditor();
    }
  };

  onMounted(async () => {
    await nextTick();
    initEditor();
    normalEditor.value.addEventListener('keyup', normalInputHandler);
    specialEditorInput.value.ref.addEventListener('input', specialInputHandler);
  });

  onBeforeUnmount(() => {
    normalEditor.value.removeEventListener('input', normalInputHandler);
    specialEditorInput.value.ref.removeEventListener('keyup', specialInputHandler);
  });

  return {
    value,
    specialEditor,
    normalEditor,
    specialEditorInput,
    currentMode,
    modes
  };
}

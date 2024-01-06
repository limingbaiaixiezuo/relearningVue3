import { computed} from 'vue';

export const sortEmits = ['update:conditions', 'change'];

export const useSortConfig = (props, emit) => {
  const conditions = computed({
    get() {
      return props.conditions;
    },
    set(val) {
      emit('update:conditions', val);
    }
  });

  return [conditions];
};


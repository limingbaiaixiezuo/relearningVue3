import { computed} from 'vue';

export const groupEmits = ['update:conditions', 'change'];

export const useGroupConfig = (props, emit) => {
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


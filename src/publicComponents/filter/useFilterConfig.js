import { computed} from 'vue';
export const useFilterConfig = (props, emit) => {
  const conditions = computed({
    get() {
      return props.conditions;
    },
    set(val) {
      emit('update:conditions', val);
    }
  });
  const conjunction = computed({
    get() {
      return props.conjunction;
    },
    set(val) {
      emit('update:conjunction', val);
      emit('change', {key: 'conjunction', value: val});
    }
  });

  return [conditions, conjunction];
};


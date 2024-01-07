import { computed} from 'vue';
export const useConditionalFilling = (props, emit) => {
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


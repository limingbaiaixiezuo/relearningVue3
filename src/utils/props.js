/**
 * prop type helpers
 * help us to write less code and reduce bundle size
 */

export const unknownProp = null;

export const numericProp = [Number, String];

export const truthProp = {
  type: Boolean,
  default: true
};

export const makeRequiredProp = (type) => ({
  type,
  required: true
});

export const makeObjectProp = (defaultVal = {}) => ({
  type: Object,
  default: () => (defaultVal)
});

export const makeArrayProp = (defaultVal = []) => ({
  type: Array,
  default: () => defaultVal
});

export const makeNumberProp = (defaultVal) => ({
  type: Number,
  default: defaultVal
});

export const makeNumericProp = (defaultVal) => ({
  type: numericProp,
  default: defaultVal
});

export const makeStringProp = (defaultVal) => ({
  type: String,
  default: defaultVal
});

export const makeBooleanProp = (defaultVal) => ({
  type: Boolean,
  default: defaultVal
});

export const makeAnyProp = (defaultVal) => ({
  default: defaultVal
});

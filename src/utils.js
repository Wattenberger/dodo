export const areEqual = (obj1={}, obj2={}, keys=[]) => {
  const changedKeys = keys.filter(key => (
    obj1[key] !== obj2[key]
  ))
  return !changedKeys.length
}

const isObject = value => Object.prototype.toString.call(value) == "[object Object]"
export const isEmpty = value => {
  return !!value
    && (!Array.isArray(value) || !value.length)
    && (!isObject(value) || !Object.keys(value).length)
}

const suffixes = {
  1: "st",
  2: "nd",
  3: "rd",
}
export const getOrdinal = n => (
  n % 100 > 10 && n % 100 < 20 ? "th"
  : suffixes[n % 10] || "th"
)
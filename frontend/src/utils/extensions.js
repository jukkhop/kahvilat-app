/* eslint-disable func-names */
/* eslint-disable no-extend-native */

Array.prototype.groupBy = function (keyFunction) {
  const groups = {}
  this.forEach(function (el) {
    const key = keyFunction(el)
    if (key in groups === false) {
      groups[key] = []
    }
    groups[key].push(el)
  })
  return Object.keys(groups).map(function (key) {
    return {
      key,
      values: groups[key],
    }
  })
}

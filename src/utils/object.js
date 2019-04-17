export function partitionObject(obj, predicate) {
  return Object.keys(obj).reduce(
    (result, key) => {
      result[predicate(obj[key], key) ? 0 : 1][key] = obj[key];
      return result;
    },
    [{}, {}]
  );
}

export function mapObject(obj, mapper) {
  return Object.entries(obj).reduce((result, [key, value]) => {
    const [newKey, newValue] = mapper(key, value);
    result[newKey] = newValue;
    return result;
  }, {});
}

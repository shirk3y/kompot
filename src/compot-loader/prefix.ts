const PREFIX_REGEX = /^([^a-zA-Z]?)(.+?)$/;

export const parsePrefix = (keyWithPrefix: string) => {
  const match = keyWithPrefix.match(PREFIX_REGEX);
  return match ? match.slice(1) : ["", keyWithPrefix];
};

export const groupByKeyPrefix = obj =>
  Object.entries(obj).reduce((groups, [keyWithPrefix, value]) => {
    const [prefix, key] = parsePrefix(keyWithPrefix);

    if (!groups[prefix]) {
      groups[prefix] = {};
    }
    groups[prefix][key] = value;

    return groups;
  }, {});

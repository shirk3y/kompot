const VAR_REGEX = /\$([a-zA-Z]+\.?([a-zA-Z0-9]+))/g;

export const findVars = (str: string) => {
  let match;
  let vars = [];
  do {
    match = VAR_REGEX.exec(str);
    if (match) {
      vars.push(match[1]);
    }
  } while (match);

  return vars;
};

export const replaceVars = (str: string, vars: any) => {
  return str.replace(VAR_REGEX, match => {
    const name = match.substr(1);

    if (!(name in vars)) {
      console.warn(`Unknown var ${name} in: "${str}"`, vars);
      return name;
    }

    return vars[name];
  });
};

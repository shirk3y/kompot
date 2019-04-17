const META_PROP_PREFIX = "";
const PROP_PREFIX = ".";

const parsePrefix = keyWithPrefix => {
  const match = keyWithPrefix.match(/^([^a-zA-Z]?)(.+?)$/);
  return match ? match.slice(1) : ["", keyWithPrefix];
};

const groupByKeyPrefix = obj =>
  Object.entries(obj).reduce((groups, [keyWithPrefix, value]) => {
    const [prefix, key] = parsePrefix(keyWithPrefix);

    if (!groups[prefix]) {
      groups[prefix] = {};
    }
    groups[prefix][key] = value;

    return groups;
  }, {});

const generateComponentCode = node => {
  if (typeof node === "string") {
    return JSON.stringify(node);
  }

  const {
    [META_PROP_PREFIX]: metaProps = {},
    [PROP_PREFIX]: props = {}
    // } = groupByKeyPrefix(node);
  } = groupByKeyPrefix(node) as any;

  const { tag = "div", type, render = [] } = metaProps;
  const element = type || JSON.stringify(tag);

  const childrenComponents = Array.isArray(render)
    ? render.map(generateComponentCode)
    : generateComponentCode(render);

  return `React.createElement(${element}, {...props, ...${JSON.stringify(
    props
  )}}, \n${childrenComponents})`;
};

export default function(source, map) {
  // module.exports = function(source, map) {
  const yaml = require("js-yaml");
  const def = yaml.load(source);

  let componentLines = [];
  let importLines = [];
  let exportLines = [];

  Object.keys(def).forEach(name => {
    if (name === "$import") {
      for (const [moduleName, moduleDef] of Object.entries(def[name])) {
        for (const [importName, importAlias] of Object.entries(moduleDef)) {
          const finalAlias = importAlias ? importAlias : importName;
          importLines.push(
            `const ${finalAlias} = require('${moduleName}').${importName};`
          );
        }
      }
    } else {
      componentLines.push(
        `const ${name} = props => ${generateComponentCode(def[name])};`
      );
      exportLines.push(`${name}`);
    }
  });

  const code = `
    const React = require('react');
  
    // imports
    ${importLines.join("\n")}
    
    // components
    ${componentLines.join("\n")}

    // exports
    module.exports = {
      ${exportLines.join(",\n")}
    };
  `;

  // console.log(code);
  // console.log("aaaa");
  // console.log("---");

  this.callback(null, code, map);
}

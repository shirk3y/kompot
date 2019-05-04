import yaml from "js-yaml";

// import { parseModule } from "./canonical";
import { parseModule } from "./prefixed";

// const appender = createItem => (...args) => {

// }

export default function(source, map) {
  const root = yaml.load(source);

  const componentLines = [];
  const handleComponent = (name, element, props, children) => {
    componentLines.push(
      `const ${name} = React.createElement(${element}, {...props, ...${JSON.stringify(
        props
      )}}, \n${children});`
    );
  };

  const importLines = [];
  const handleImport = (module_, name, alias) => {
    importLines.push(`const ${alias} = require('${module_}').${name};`);
  };

  const exportLines = [];
  const handleExport = name => {};

  parseModule(root, handleImport, handleExport, handleComponent);

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

  console.warn(code);

  this.callback(null, code, map);
}

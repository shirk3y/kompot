import yaml from "js-yaml";
import { stringifyRequest } from "loader-utils";
import { parseImports, parseComponents } from "../compot-loader/parser";

export default function(source, map) {
  const root = yaml.load(source);
  const rootId = JSON.parse(
    stringifyRequest(this, this.request.replace(/^.+?!/, ""))
  );

  const globalImportsCode = `
    import React from 'react';
    import { createComponent } from "../compot-loader/component";
  `;

  const imports = parseImports(root);

  const importsCode = imports
    .map(
      info =>
        `const ${info.alias} = require(${JSON.stringify(info.module)}).${
          info.symbol
        };`
    )
    .join("\n");

  const components = parseComponents(root, {}, imports);

  const componentsCode = components
    .map(
      info =>
        `export const ${info.name} = createComponent(${JSON.stringify(info)});`
    )
    .join("\n");

  const code = `
    ${globalImportsCode}
    
    ${importsCode}
   
    ${componentsCode}
  `;

  this.callback(null, code, map);
}

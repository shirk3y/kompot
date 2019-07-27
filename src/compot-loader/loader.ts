import yaml from "js-yaml";
import { stringifyRequest } from "loader-utils";
import {
  // parseImports,
  // parseComponents,
  parseModule
} from "../compot-loader/parser";

export default function compotWebpackLoader(source, map) {
  const root = yaml.load(source);
  const rootId = JSON.parse(
    stringifyRequest(this, this.request.replace(/^.+?!/, ""))
  ).replace(/(^\.\/|\.compot\.yml)/gi, "");

  const globalImportsCode = `
    import React from 'react';
    import { createComponent } from "../compot-loader/component";
  `;

  const moduleInfo = parseModule(root, rootId);
  // const imports = parseImports(root);

  const importsCode = moduleInfo.imports
    .map(
      info =>
        `const ${info.alias} = require(${stringify(info.module)}).${
          info.symbol
        };`
    )
    .join("\n\n");

  // const components = parseComponents(root, {}, rootId, imports);

  const componentsCode = moduleInfo.components
    .map(
      info =>
        `export const ${info.name} = createComponent(
          ${stringify(info)},
          { ${findTypes(info).join(", ")} }
        );`
    )
    .join("\n\n");

  const code = `
    ${globalImportsCode}
    
    ${importsCode}
   
    ${componentsCode}
  `;

  console.info(code);

  this.callback(null, code, map);
}

const stringify = obj => JSON.stringify(obj, undefined, 2);

const findTypes = info => {
  let types = [];

  if (info.type) {
    types.push(info.type);
  }

  if (info.children) {
    info.children.forEach(childInfo => {
      types = [...types, ...findTypes(childInfo)];
    });
  }

  return Array.from(new Set(types));
};

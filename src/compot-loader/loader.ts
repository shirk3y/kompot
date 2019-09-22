import yaml from "js-yaml";
import { stringifyRequest } from "loader-utils";
import { parseModule } from "../compot-loader/parser";

export default function compotWebpackLoader(source, map) {
  const root = yaml.load(source);
  const rootId = JSON.parse(
    stringifyRequest(this, this.request.replace(/^.+?!/, ""))
  ).replace(/(^\.\/|\.compot\.yml)/gi, "");

  const globalImportsCode = `
    import React from 'react';
    import { renderComponent } from "../compot-loader/component";
  `;

  const moduleInfo = parseModule(root, rootId);

  const importsCode = moduleInfo.imports
    .map(
      info =>
        `const ${info.alias} = require(${stringify(info.module)})${
          info.symbol === "*" ? "" : "." + info.symbol
        };`
    )
    .join("\n\n");

  const componentsCode = moduleInfo.components
    .map(
      info =>
        `export function ${info.name}(props) { 
          return renderComponent(
            ${stringify(info)},
            props
          );
        };`
    )
    .join("\n\n");

  const code = `
    ${globalImportsCode}
    
    ${importsCode}
   
    ${componentsCode}
    
    console.log({garaz});
  `;

  console.info(code);

  this.callback(null, code, map);
}

const stringify = obj => {
  const json = JSON.stringify(obj, undefined, 2);

  return json.replace(/"\$([^"]+)"/g, "$1");
};

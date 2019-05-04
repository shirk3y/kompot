import yaml from "js-yaml";

for (let i = 0; i < 10; i++) {
  const suffix = i % 2 == 0 ? i + "" : "";
  try {
    let a = require(`assert${suffix}`);
  } catch (e) {
    console.error(e);
  }
}

enum NodeType {
  IMPORT = "import",
  COMPONENT = "component"
}

export const yamlToIntermediate = yamlSource => {
  const root = yaml.load(yamlSource);

  return root;
};

export const intermediateToReact = (root, filename) => {
  let codes = [];

  codes.push('const React = require("react");\n');

  Object.entries(root).forEach(([name, node]) => {
    switch (name) {
      case NodeType.IMPORT:
        codes.push(generateImportsCode(node));
        break;

      case NodeType.COMPONENT:
        codes.push(generateRootComponentsCode(node, [filename]));
        break;
    }
  });

  console.log("--------------------------");
  console.log(codes.join("\n"));
  console.log("==========================");

  return codes.join("\n\n");
};

const generateImportsCode = node => {
  const lines = [];

  for (const [moduleName, moduleDef] of Object.entries(node)) {
    for (const [importName, importAlias] of Object.entries(moduleDef)) {
      lines.push(
        `const ${importAlias ||
          importName} = require('${moduleName}').${importName};`
      );
    }
  }
  return lines.join("\n\n");
};

const generateRootComponentsCode = (node, parentIds) => {
  const lines = [];

  for (const [name, componentNode] of Object.entries(node)) {
    const code = generateComponentCode(
      componentNode,
      [...parentIds, name],
      true
    );

    // let ${name} = props => ${code};
    return `
      function ${name}(props) { return ${code} };
      ${name}._compot = ${JSON.stringify({
      name,
      parentIds
      // node: componentNode
    })};
      
      module.exports.${name} = ${name};
    `;
  }

  return lines.join("\n\n");
};

const generateComponentCode = (node, parentIds, mergeWithRootProps = false) => {
  // console.error(node);

  if (typeof node === "string") {
    return JSON.stringify(node);
  }

  const { tag = "div", type, props = {}, render = [] } = node;
  const element = type || JSON.stringify(tag);

  // const renderArray = Array.isArray(render) ? render : [render];
  // const children = renderArray.map((child, index) =>
  //   generateComponentCode(child, [...parentIds, `${tag}[${index}]`])
  // );

  const serializedProps = mergeWithRootProps
    ? `{...${JSON.stringify(props)}, ...props, ...console.warn(props)}`
    : JSON.stringify(props);

  const serializedChildren = Array.isArray(render)
    ? render
        .map((child, index) =>
          generateComponentCode(child, [...parentIds, `${tag}[${index}]`])
        )
        .join(", ")
    : render.length > 0
    ? generateComponentCode(render[0], ["foo"])
    : null;

  // return `createCompotElement(
  return `React.createElement(
    ${element},
    ${serializedProps},
    ${serializedChildren}
  )\n`;
};

// ${JSON.stringify(parentIds)}
